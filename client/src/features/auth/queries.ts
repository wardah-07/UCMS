import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authApi } from "./api";
import type { User } from "@ucms/shared";

export const userQueryKey = ["user"];

// shared by useCurrentUser and the router loaders in app/routeGuards.js so
// both read/write the exact same cache entry instead of fetching independently
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await authApi.me();
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    throw err;
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKey,
    queryFn: fetchCurrentUser,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user: User) => queryClient.setQueryData(userQueryKey, user),
  });
}

export function useRegister() {
  // registering does not authenticate the caller, so the user cache is left alone
  return useMutation({ mutationFn: authApi.register });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.setQueryData(userQueryKey, null),
  });
}
