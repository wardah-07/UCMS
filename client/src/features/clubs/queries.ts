import { useMutation } from "@tanstack/react-query";
import { clubsApi } from "./api";

export function useCreateClub() {
  return useMutation({ mutationFn: clubsApi.createClub });
}
