import { apiClient } from "@/lib/apiClient";
import { clubSchema } from "@ucms/shared";
import type { Club, ClubCreationInput, ClubUpdateInput } from "@ucms/shared";

// Responses are run through clubSchema.parse() rather than just asserted
// with a generic (apiClient.post<Club>(...)) — a generic is a compile-time-
// only promise to TS, axios never checks it against what actually came
// back. parse() throws if the server's shape ever drifts from what the
// client expects, instead of silently handing out mistyped data.
export const clubsApi = {
  async createClub(data: ClubCreationInput): Promise<Club> {
    const { data: club } = await apiClient.post("/clubs", data);
    return clubSchema.parse(club);
  },

  async getClubs(): Promise<Club[]> {
    const { data: clubs } = await apiClient.get("/clubs");
    return clubs;
  },

  async getMyClubs(): Promise<Club[]> {
    const { data: clubs } = await apiClient.get("/clubs/mine");
    return clubs;
  },

  async deleteClub(id: number): Promise<void> {
    await apiClient.delete(`/clubs/${id}`);
  },

  async updateClub(id: number, data: ClubUpdateInput): Promise<Club> {
    const { data: club } = await apiClient.patch(`/clubs/${id}`, data);
    return clubSchema.parse(club);
  },
};
