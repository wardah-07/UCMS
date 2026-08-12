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

// child route paths under the pathless RootLayout must be relative
const relative = (path) => path.slice(1);

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
        loader: redirectIfAuthenticated(ROUTES.STUDENT),
      },
      { path: relative(ROUTES.STUDENT), element: <StudentDashboard /> },
      {
        path: relative(ROUTES.ORGANIZER_DASHBOARD),
        element: <OrganizerDashboard />,
        loader: requireRole("ORGANIZER"),
      },
      {
        path: relative(ROUTES.ADMIN_DASHBOARD),
        element: <AdminDashboard />,
        loader: requireRole("ADMIN"),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
