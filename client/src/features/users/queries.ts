import { usersApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserUpdateInput } from "@ucms/shared";

export const usersQueryKey = ["users"];

export function useCreateUser() {
  return useMutation({ mutationFn: usersApi.createUser });
}

export function useGetUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: usersApi.getUsers,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UserUpdateInput }) =>
      usersApi.updateUser(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}
