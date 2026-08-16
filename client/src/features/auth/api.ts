import { apiClient } from "@/lib/apiClient";
import type { RegisterInput, LoginInput } from "@ucms/shared";

export const authApi = {
  async login(credentials: LoginInput) {
    const { data: user } = await apiClient.post("/auth/login", credentials);
    return user;
  },

  async register(data: RegisterInput) {
    const { data: user } = await apiClient.post("/auth/register", data);
    return user;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async me() {
    const { data: user } = await apiClient.get("/me");
    return user;
  },
};
