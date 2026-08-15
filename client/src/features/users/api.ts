import { apiClient } from "@/lib/apiClient";

export const usersApi = {
  async createUser(data) {
    const { data: user } = await apiClient.post("/users", data);
    return user;
  },

  async getUsers() {
    const { data: users } = await apiClient.get("/users");
    return users;
  },

  async updateUser(id, updates) {
    const { data: user } = await apiClient.patch(`/users/${id}`, updates);
    return user;
  },
};
