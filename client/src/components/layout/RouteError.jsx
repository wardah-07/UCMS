import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router";
import { getErrorMessage } from "@/lib/apiClient";
import { ROUTES } from "@/constants/routes";

// Router-level errorElement: catches errors thrown by loaders (e.g. requireRole,
// redirectIfAuthenticated) that aren't a plain 401. Rendered in place of the
// route's element, so it stays nested wherever the failing route was.
export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? error.statusText || `Error ${error.status}`
    : getErrorMessage(error, "Something went wrong loading this page.");

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-danger">Error</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Something went wrong
        </h1>
        <p className="text-sm text-ink-soft">{message}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(0)}
          className="cursor-pointer rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Try again
        </button>
        <button
          onClick={() => navigate(ROUTES.STUDENT)}
          className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
        >
          Go home
        </button>
      </div>
    </div>
  );
}
