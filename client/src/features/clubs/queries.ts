import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clubsApi } from "./api";
import type { ClubUpdateInput } from "@ucms/shared";

export const clubsQueryKey = ["clubs"];
export const myClubsQueryKey = ["clubs", "mine"];

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubsApi.createClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubsQueryKey });
      queryClient.invalidateQueries({ queryKey: myClubsQueryKey });
    },
  });
}

export function useGetClubs() {
  return useQuery({
    queryKey: clubsQueryKey,
    queryFn: clubsApi.getClubs,
  });
}

export function useGetMyClubs() {
  return useQuery({
    queryKey: myClubsQueryKey,
    queryFn: clubsApi.getMyClubs,
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubsApi.deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubsQueryKey });
      queryClient.invalidateQueries({ queryKey: myClubsQueryKey });
    },
  });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClubUpdateInput }) =>
      clubsApi.updateClub(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubsQueryKey });
      queryClient.invalidateQueries({ queryKey: myClubsQueryKey });
    },
  });
}
