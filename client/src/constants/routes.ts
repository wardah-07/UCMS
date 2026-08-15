export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  //admin
  ADMIN: "/admin",
  ADMIN_USER_MANAGEMENT: "/users",
  //student
  STUDENT: "/student",
  //organizer
  ORGANIZER: "/organizer",
} as const satisfies Record<string, `/${string}`>;

// Union of every path string in ROUTES, derived instead of hand-written
// so it can never drift out of sync: "/" | "/auth" | "/admin" | ...
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
