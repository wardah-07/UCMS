import { createBrowserRouter } from "react-router";
import AuthPage from "@/pages/auth/AuthPage";
import { redirectIfAuthenticated, requireRole } from "./routeGuards";
import RootLayout from "@/components/layout/RootLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";

// child route paths under the pathless RootLayout must be relative
const relative = (path) => path.slice(1);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    loader: redirectIfAuthenticated(ROUTES.STUDENT),
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: relative(ROUTES.AUTH),
        element: <AuthPage />,
        loader: redirectIfAuthenticated(),
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
