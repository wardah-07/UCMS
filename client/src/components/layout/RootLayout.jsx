import { Outlet, useNavigate } from "react-router";
import { useCurrentUser, useLogout } from "@/features/auth";
import { getErrorMessage } from "@/lib/apiClient";
import { ROUTES } from "@/constants/routes";

export default function RootLayout() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.STUDENT),
    });
  }

  return (
    <div>
      <nav>
        UCMS nav
        {user && (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout} disabled={logout.isPending}>
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>
            {logout.isError && <p>{getErrorMessage(logout.error)}</p>}
          </>
        )}
        {!user && (
          <button onClick={() => navigate(ROUTES.AUTH)}>Login</button>
        )}
      </nav>
      <Outlet context={{ user }} />
    </div>
  );
}
