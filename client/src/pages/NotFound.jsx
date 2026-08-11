export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="text-sm text-ink-soft">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
