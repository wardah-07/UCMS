import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export function getErrorMessage(
  error: AxiosError<{ message?: string }>,
  fallback = "Something went wrong. Please try again.",
) {
  return error.response?.data?.message ?? fallback;
}
