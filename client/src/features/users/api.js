import { apiClient } from "@/lib/apiClient";

export const usersApi = {
  async createUser(data) {
    const { data: user } = await apiClient.post("/users/create", data);
    return user;
  },

  async editUser() {},
};
