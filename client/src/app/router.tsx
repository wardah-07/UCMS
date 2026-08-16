import { createBrowserRouter } from "react-router";
import AuthPage from "@/pages/auth/AuthPage";
import { redirectIfAuthenticated, requireRole } from "./routeGuards";
import RootLayout from "@/components/layout/RootLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";
import RouteError from "@/components/layout/RouteError";
import { ROUTES } from "@/constants/routes";
import type { Route } from "@/constants/routes";
import UserOperations from "@/pages/admin/UserOperations";

// child route paths under the pathless RootLayout must be relative
const relative = (path: Route) => path.slice(1);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    loader: redirectIfAuthenticated(ROUTES.STUDENT),
    errorElement: <RouteError />,
  },
  {
    element: <RootLayout />,
    // Catches loader errors thrown by any child route below (redirectIfAuthenticated,
    // requireRole) that aren't a plain 401 — those already resolve to `null` in
    // fetchCurrentUser and redirect normally instead of throwing.
    errorElement: <RouteError />,
    children: [
      {
        path: relative(ROUTES.AUTH),
        element: <AuthPage />,
        loader: redirectIfAuthenticated(),
      },
      {
        path: ROUTES.STUDENT,
        children: [{ index: true, element: <StudentDashboard /> }],
      },
      {
        path: ROUTES.ORGANIZER,
        loader: requireRole("ORGANIZER"),
        children: [{ index: true, element: <OrganizerDashboard /> }],
      },
      {
        path: ROUTES.ADMIN,
        loader: requireRole("ADMIN"),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: relative(ROUTES.ADMIN_USER_MANAGEMENT),
            element: <UserOperations />,
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
