import { createBrowserRouter } from "react-router";
import { rootLoader, requireAdmin, requireOrganizer } from "./lib/auth";
import RootLayout from "./components/RootLayout";
import Auth from "./pages/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: rootLoader,
    errorElement: <div>Root error has occured!</div>,
  },
  {
    element: <RootLayout />,
    errorElement: <div>An error has occured!</div>,
    children: [
      { path: "auth", element: <Auth /> },
      { path: "student/dashboard", element: <div>student dashboard</div> },
      {
        path: "organizer/dashboard",
        element: <div>organizer dashboard</div>,
        loader: requireOrganizer,
      },
      {
        path: "admin/dashboard",
        element: <div>admin dashboard</div>,
        loader: requireAdmin,
      },
    ],
  },
]);
