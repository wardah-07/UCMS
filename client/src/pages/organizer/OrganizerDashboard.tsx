import { Link } from "react-router";

export default function OrganizerDashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold tracking-wide text-ink uppercase">
        Organizer dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Manage courses and events you're running.
      </p>
      <Link
        to={"/organizer/clubs"}
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
      >
        Manage Clubs
      </Link>
    </div>
  );
}
