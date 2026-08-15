import { redirect } from "react-router";
import { queryClient } from "./queryClient";
import { userQueryKey, fetchCurrentUser } from "@/features/auth";
import { getHomeRouteForRole } from "@/util/getHomeRouteForRole";
import { ROUTES } from "@/constants/routes";

function getUser() {
  return queryClient.ensureQueryData({
    queryKey: userQueryKey,
    queryFn: fetchCurrentUser,
  });
}

// Redirects authenticated users to their role's home route. When `fallback` is
// given, unauthenticated users are redirected there too (e.g. "/"); when
// omitted, unauthenticated users are left on the current route (e.g. "/auth").
export function redirectIfAuthenticated(fallback) {
  return async function loader() {
    const user = await getUser();
    if (user) throw redirect(getHomeRouteForRole(user.role));
    if (fallback) throw redirect(fallback);
    //let user navigate to chosen route if no fallback
    return null;
  };
}

export function requireRole(role) {
  return async function loader() {
    const user = await getUser();
    if (!user) throw redirect(ROUTES.STUDENT);
    if (user.role !== role) throw redirect(getHomeRouteForRole(user.role));
    return null;
  };
}
