import { ROUTES, type Route } from "@/constants/routes";
import type { Role } from "@ucms/shared";

export function getHomeRouteForRole(role: Role): Route {
  switch (role) {
    case "ADMIN":
      return ROUTES.ADMIN;
    case "ORGANIZER":
      return ROUTES.ORGANIZER;
    case "STUDENT":
      return ROUTES.STUDENT;
    default:
      return ROUTES.HOME;
  }
}
