import { apiClient } from "@/lib/apiClient";

export const authApi = {
  async login(credentials) {
    await apiClient.post("/auth/login", credentials);
    // login response omits role, so fetch the full profile the rest of the app relies on
    return authApi.me();
  },

  async register(data) {
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
