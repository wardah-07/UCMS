import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useCurrentUser, useLogout } from "@/features/auth";
import { getErrorMessage } from "@/lib/apiClient";
import { ROUTES } from "@/constants/routes";
import { getHomeRouteForRole } from "@/util/getHomeRouteForRole";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const DASHBOARD_LABEL_BY_ROLE = {
  ADMIN: "Admin Dashboard",
  ORGANIZER: "Organizer Dashboard",
};

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const isAuthPage = location.pathname === ROUTES.AUTH;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutConfirm(false);
        navigate(ROUTES.STUDENT);
      },
    });
  }

  return (
    <div className="min-h-screen bg-paper">
      <nav className="flex items-center justify-between border-b border-border bg-surface px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.STUDENT}
            className="text-lg font-semibold tracking-tight text-ink"
          >
            UCMS
          </Link>
          {user && DASHBOARD_LABEL_BY_ROLE[user.role] && (
            <Link
              to={getHomeRouteForRole(user.role)}
              className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
            >
              {DASHBOARD_LABEL_BY_ROLE[user.role]}
            </Link>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-soft">{user.name}</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={logout.isPending}
              className="cursor-pointer rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>
            {logout.isError && (
              <p className="text-sm text-danger">
                {getErrorMessage(logout.error)}
              </p>
            )}
          </div>
        )}
        {!user && !isAuthPage && (
          <button
            onClick={() => navigate(ROUTES.AUTH)}
            className="cursor-pointer rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Login
          </button>
        )}
      </nav>
      <Outlet context={{ user }} />

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        description="You'll need to sign in again to access your account."
        confirmLabel="Log out"
        isLoading={logout.isPending}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
