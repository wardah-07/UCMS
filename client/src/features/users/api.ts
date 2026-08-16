import { apiClient } from "@/lib/apiClient";
import { userSchema } from "@ucms/shared";
import type { User, UserCreationInput, UserUpdateInput } from "@ucms/shared";

// Responses are run through userSchema.parse() rather than just asserted
// with a generic (apiClient.get<User>(...)) — a generic is a compile-time-
// only promise to TS, axios never checks it against what actually came
// back. parse() throws if the server's shape ever drifts from what the
// client expects, instead of silently handing out mistyped data.
export const usersApi = {
  async createUser(data: UserCreationInput): Promise<User> {
    const { data: user } = await apiClient.post("/users", data);
    return userSchema.parse(user);
  },

  async getUsers(): Promise<User[]> {
    const { data: users } = await apiClient.get("/users");
    return userSchema.array().parse(users);
  },

  async updateUser(id: number, updates: UserUpdateInput): Promise<User> {
    const { data: user } = await apiClient.patch(`/users/${id}`, updates);
    return userSchema.parse(user);
  },
};
