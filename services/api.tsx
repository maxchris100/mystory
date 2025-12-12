// services/api.tsx
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

const api: AxiosInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: false,
});

// In-memory cache to avoid fetching token on every request
let cachedAuthToken: string | null = null;
let cachedAuthTokenExpiresAtMs = 0;

async function ensureAuthToken(): Promise<string | null> {
	try {
		if (typeof window === "undefined") {
			return null;
		}
		const now = Date.now();
		if (cachedAuthToken && now < cachedAuthTokenExpiresAtMs - 5000) {
			return cachedAuthToken;
		}
		const res = await fetch("/api/auth/me", { method: "GET" });
		if (!res.ok) {
			cachedAuthToken = null;
			cachedAuthTokenExpiresAtMs = 0;
			return null;
		}
		const data: any = await res.json();
		if (data?.authenticated && data?.token) {
			cachedAuthToken = data.token as string;
			cachedAuthTokenExpiresAtMs = data?.expiresAt ? new Date(data.expiresAt).getTime() : now + 5 * 60 * 1000;
			return cachedAuthToken;
		}
		cachedAuthToken = null;
		cachedAuthTokenExpiresAtMs = 0;
		return null;
	} catch {
		cachedAuthToken = null;
		cachedAuthTokenExpiresAtMs = 0;
		return null;
	}
}
export async function getAuthHeader(): Promise<Record<string, string> | undefined> {
    const token = await ensureAuthToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return undefined;
}
api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await ensureAuthToken();
		if (token) {
			config.headers = config.headers || {};
			(config.headers as any).Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: unknown) => Promise.reject(error)
);

export default api;

export type { AxiosInstance };
