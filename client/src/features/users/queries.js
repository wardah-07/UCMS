import { usersApi } from "./api";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  return useMutation({ mutationFn: usersApi.createUser });
}
