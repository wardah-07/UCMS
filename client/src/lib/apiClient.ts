import axios from "axios";
import { ZodError } from "zod";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// error is `unknown` because callers pass whatever they actually have on
// hand: a TanStack Query mutation/query error, a react-router loader error
// from useRouteError(), a raw catch(err) — none of which TS can narrow for
// us up front.
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  // Thrown by a schema's .parse() call (e.g. userSchema.parse() in
  // features/users/api.ts) when a response doesn't match the shape we
  // expect. That's a client/server contract bug, not a normal request
  // failure, so it gets its own message instead of the generic fallback -
  // and gets logged, since the user has no way to "fix" this themselves.
  if (error instanceof ZodError) {
    console.error("Unexpected API response shape:", error.issues);
    return "Unexpected response from the server. Please try again later.";
  }

  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}
