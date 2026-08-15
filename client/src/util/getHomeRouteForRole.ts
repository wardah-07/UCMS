import { ROUTES, type Route } from "@/constants/routes";

type Role = "ADMIN" | "ORGANIZER" | "STUDENT";

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
