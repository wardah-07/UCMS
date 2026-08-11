import { ROUTES } from "../constants/routes";

export function getHomeRouteForRole(role) {
  switch (role) {
    case "ADMIN":
      return ROUTES.ADMIN_DASHBOARD;
    case "ORGANIZER":
      return ROUTES.ORGANIZER_DASHBOARD;
    case "STUDENT":
      return ROUTES.STUDENT;
    default:
      return ROUTES.HOME;
  }
}
