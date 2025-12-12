// services/auth.ts
import api from "./api";

export interface RegisterWaitingListRequest {
	email: string;
	name: string;
	phone: string;
	role?: string;
	reason?: string;
}

export interface WaitingListUser {
	id: string;
	email: string;
	name: string;
	phone: string;
	role: string;
	reason?: string;
	createdAt: string;
}

export interface LoginRequest {
	email: string;
	password: string;
	role?: string;
	fcmToken?: string;
}

export interface LoginResponse {
	token: string;
	refreshToken?: string;
	user?: any;
	session?: any;
	message?: string;
	route?: string;
}

export interface VerifyOtpRequest {
	email: string;
	otp: string;
	fcmToken?: string;
}

export interface ResendOtpRequest {
	email: string;
}

export interface FirebaseLoginRequest {
	idToken: string;
	provider: "google" | "apple" | "linkedin";
	fcmToken?: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

// Client-first cookie handling via Next API routes to avoid server-only imports in client bundles

export const authService = {
	registerWaitingList: async (payload: RegisterWaitingListRequest) => {
		const { data } = await api.post("/auth/register-waitinglist", payload);
		return data;
	},


	getWaitingListCount: async () => {
		const { data } = await api.get<{ count: number }>("/auth/waitinglist/count");
		return data;
	},
	getWaitingList: async (): Promise<any> => {
		const { data } = await api.get<any>("/auth/waitinglist");
		return data;
	},
	//

	register: async (payload: LoginRequest) => {
		const { data } = await api.post<LoginResponse>("/auth/register", payload);
		return data;
	},
	login: async (payload: LoginRequest) => {
		const { data, } = await api.post<LoginResponse>("/auth/login", payload);
		if (data.token && typeof window !== "undefined") {
			await fetch("/api/auth/set-cookie", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: data.token, expiresAt: data.session?.expiresAt }),
			});
		}
		return data;
	},

	verifyOtp: async (payload: VerifyOtpRequest) => {
		const { data } = await api.post("/auth/verify-otp", payload);

		if (data.token && typeof window !== "undefined") {
			await fetch("/api/auth/set-cookie", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: data.token, expiresAt: data.session?.expiresAt }),
			});
		}
		return data;
	},

	resendOtp: async (payload: ResendOtpRequest) => {
		// Assuming endpoint exists as /auth/resend-otp based on feature request
		const { data } = await api.post<{ success: boolean }>("/auth/resend-otp", payload);
		return data;
	},

	loginWithFirebase: async (payload: FirebaseLoginRequest) => {
		const { data } = await api.post<LoginResponse>("/auth/login/firebase", payload);
		if (data.token && typeof window !== "undefined") {
			await fetch("/api/auth/set-cookie", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: data.token, expiresAt: data.session?.expiresAt }),
			});
		}
		return data;
	},

	logout: async () => {
		if (typeof window !== "undefined") {
			await fetch("/api/auth/clear-cookie", { method: "POST" });
			return true;
		}
		return true;
	},
	getAuthToken: async () => {
		// HttpOnly cookie cannot be read on client; return null on client
		return null as any;
	},
	// Client-friendly auth status check (cannot read HttpOnly cookie directly)
	isAuthenticated: async (): Promise<boolean> => {
		try {
			const res = await fetch("/api/auth/me", { method: "GET" });
			if (!res.ok) return false;
			const json = await res.json();
			return Boolean(json?.authenticated);
		} catch {
			return false;
		}
	},
	getSession: async (): Promise<any> => {
		try {
			const res = await fetch("/api/auth/me", { method: "GET" });
			if (!res.ok) return null;
			const json = await res.json();
			return json
		} catch {
			return null;
		}
	},
	getProfileSession: async (sessionUuid: string): Promise<any> => {
		const { data } = await api.get<any>(`/auth/session?sessionUuid=${sessionUuid}`);
		return data;
	},
	forgotPassword: async (payload: ForgotPasswordRequest) => {
		const { data } = await api.post<{ success: boolean }>("/auth/forgot-password", payload);
		return data;
	},

	resetPassword: async (payload: ResetPasswordRequest) => {
		const { data } = await api.post<{ success: boolean }>("/auth/reset-password", payload);
		return data;
	},
};

export default authService;