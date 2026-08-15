import { usersApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: ({ id, updates }) => usersApi.updateUser(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}
