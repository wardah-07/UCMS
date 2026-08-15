import { Link } from "react-router";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Admin dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Overview and controls for the university system.
      </p>
      <Link
        to={"/admin/users"}
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
      >
        Manage Users
      </Link>
    </div>
  );
}
