import { ROUTES } from "@/constants/routes";

export function getHomeRouteForRole(role) {
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
