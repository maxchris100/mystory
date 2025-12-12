// services/admin.tsx
import api from "./api";

export interface AdminProjectFile {
    id: string;
    type: string;      // e.g., "IFC", "FRAG"
    version: number;
    publicUrl: string;
}

export interface AdminProjectMember {
    id: string;
    role: string;
    status: string;
    colorHex?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export interface AdminProject {
    id: string;
    name: string;
    description?: string;
    owner: AdminUser;
    ownerId: string;
    createdAt?: string;
    updatedAt?: string;
    members?: AdminProjectMember[];
    files?: AdminProjectFile[];
}
export interface AdminMaterial {
    id: string;
    name: string;
    type?: string;
    category?: string;
    description?: string;
    colorHex?: string;
    density?: number;
    thermalCond?: number;
    strength?: number;
    unit?: string;
    price?: number;
    currency?: string;
    metadata?: any;
    textureUrl?: string;
    updatedAt?: string;
}

export interface AdminMaterialCreateInput {
    name: string;
    type: string;
    category?: string;
    description?: string;
    colorHex?: string;
    density?: number;
    thermalCond?: number;
    strength?: number;
    unit?: string;
    price?: number;
    currency?: string;
    metadata?: any;
    textureUrl?: string;
    texture?: File;
}

export interface AdminMaterialUpdateInput extends Partial<AdminMaterialCreateInput> { }

export interface AdminPlan {
    id: string;
    name: string;
    // optional legacy fields used by some UIs
    projectName?: string;
    status?: string;
    features?: AdminPlanFeatures;
    updatedAt?: string;
}

export interface AdminPlanCreateInput {
    name: string;
    features?: AdminPlanFeatures;
}

export interface AdminPlanUpdateInput extends Partial<AdminPlanCreateInput> { }

export interface AdminPlanPrice {
    id: string;
    currency: string;
    interval: string;
    amount: number;
    createdAt?: string;
}

export interface AdminPlanPriceCreateInput {
    currency: string;
    interval: string;
    amount: number;
}

export interface AdminPlanPriceUpdateInput extends Partial<AdminPlanPriceCreateInput> { }

// Strongly typed features for Plan
export type AdminPlanStorageMb = 100 | 1000 | 10000;
export type AdminPlanMaterialAccess = 0 | 1 | 2;
export interface AdminPlanFeatures {
    max_collaboration?: number;
    max_project?: number;
    max_storage_mb?: AdminPlanStorageMb;
    access_material_library?: AdminPlanMaterialAccess;
}
export interface AdminUserSubscription {
    id: string;
    userId: string;
    planId: string;
    priceId: string;
    status: string;
    startedAt?: string | null;
    expiredAt?: string | null;
    createdAt?: string;
}

export interface AdminUser {
    id: string;
    name?: string;
    email: string;
    role?: string;
    createdAt?: string;
    subscription?: AdminUserSubscription | null;
    _count?: {
        ownedProjects: number;
        memberships: number;
        payment: number;
    };
}

export interface AdminPartner {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    zipcode?: string | null;
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminPartnerCreateInput {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    zipcode?: string;
    status?: string;
}

export interface AdminPartnerUpdateInput extends Partial<AdminPartnerCreateInput> { }

export const adminApiService = {
    listProjects: async (): Promise<AdminProject[]> => {
        const { data } = await api.get<AdminProject[]>("/admin/v1/projects");
        return data;
    },

    listMaterials: async (params?: {
        q?: string;
        type?: string;
        category?: string;
        skip?: number;
        take?: number;
    }): Promise<AdminMaterial[]> => {
        const { data } = await api.get<any>("/admin/v1/materials", { params });
        return data.items;
    },

    getMaterial: async (id: string): Promise<AdminMaterial> => {
        const { data } = await api.get<AdminMaterial>(`/admin/v1/materials/${id}`);
        return data;
    },

    createMaterial: async (payload: AdminMaterialCreateInput): Promise<AdminMaterial> => {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        });

        const { data } = await api.post<AdminMaterial>("/admin/v1/materials", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    updateMaterial: async (id: string, payload: AdminMaterialUpdateInput): Promise<AdminMaterial> => {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        });

        const { data } = await api.put<AdminMaterial>(`/admin/v1/materials/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    deleteMaterial: async (id: string): Promise<{ success: boolean }> => {
        const { data } = await api.delete<{ success: boolean }>(`/admin/v1/materials/${id}`);
        return data;
    },

    listPlans: async (): Promise<AdminPlan[]> => {
        const { data } = await api.get<any>("/admin/v1/plans");
        // Some endpoints return { items }, others return an array directly
        return (data?.items ?? data) as AdminPlan[];
    },
    getPlan: async (id: string): Promise<AdminPlan> => {
        const { data } = await api.get<AdminPlan>(`/admin/v1/plans/${id}`);
        return data;
    },
    createPlan: async (payload: AdminPlanCreateInput): Promise<AdminPlan> => {
        const { data } = await api.post<AdminPlan>(`/admin/v1/plans`, payload);
        return data;
    },
    updatePlan: async (id: string, payload: AdminPlanUpdateInput): Promise<AdminPlan> => {
        const { data } = await api.put<AdminPlan>(`/admin/v1/plans/${id}`, payload);
        return data;
    },
    deletePlan: async (id: string): Promise<{ success: boolean }> => {
        const { data } = await api.delete<{ success: boolean }>(`/admin/v1/plans/${id}`);
        return data;
    },
    listPlanPrices: async (id: string): Promise<AdminPlanPrice[]> => {
        const { data } = await api.get<AdminPlanPrice[]>(`/admin/v1/plans/${id}/prices`);
        return data;
    },
    addPlanPrice: async (id: string, payload: AdminPlanPriceCreateInput): Promise<AdminPlanPrice> => {
        const { data } = await api.post<AdminPlanPrice>(`/admin/v1/plans/${id}/prices`, payload);
        return data;
    },
    updatePlanPrice: async (
        id: string,
        priceId: string,
        payload: AdminPlanPriceUpdateInput,
    ): Promise<AdminPlanPrice> => {
        const { data } = await api.put<AdminPlanPrice>(`/admin/v1/plans/${id}/prices/${priceId}`, payload);
        return data;
    },
    deletePlanPrice: async (id: string, priceId: string): Promise<{ success: boolean }> => {
        const { data } = await api.delete<{ success: boolean }>(`/admin/v1/plans/${id}/prices/${priceId}`);
        return data;
    },
    listUsers: async (): Promise<AdminUser[]> => {
        const { data } = await api.get<AdminUser[]>("/admin/v1/users");
        return data;
    },

    // Partners
    listPartners: async (params?: {
        q?: string;
        skip?: number;
        take?: number;
    }): Promise<AdminPartner[]> => {
        const { data } = await api.get<any>("/admin/v1/partners", { params });
        // Some endpoints return { items }, others return an array directly
        return (data?.items ?? data) as AdminPartner[];
    },

    getPartner: async (id: string): Promise<AdminPartner> => {
        const { data } = await api.get<AdminPartner>(`/admin/v1/partners/${id}`);
        return data;
    },

    createPartner: async (payload: AdminPartnerCreateInput): Promise<AdminPartner> => {
        const { data } = await api.post<AdminPartner>(`/admin/v1/partners`, payload);
        return data;
    },

    updatePartner: async (id: string, payload: AdminPartnerUpdateInput): Promise<AdminPartner> => {
        const { data } = await api.put<AdminPartner>(`/admin/v1/partners/${id}`, payload);
        return data;
    },

    deletePartner: async (id: string): Promise<{ success: boolean }> => {
        const { data } = await api.delete<{ success: boolean }>(`/admin/v1/partners/${id}`);
        return data;
    },
};

export default adminApiService;
