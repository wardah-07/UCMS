import { useState } from "react";
import { CreateUser, ManageUsers } from "@/features/users";

const VIEWS = {
  CREATE: "create",
  MANAGE: "manage",
  OTHER: "other",
};

const TABS = [
  { id: VIEWS.CREATE, label: "Create" },
  { id: VIEWS.MANAGE, label: "Manage" },
  { id: VIEWS.OTHER, label: "Other" },
];

const UserOperations = () => {
  const [view, setView] = useState(VIEWS.MANAGE);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        User operations
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Create and manage user accounts for the university system.
      </p>

      <div className="mt-6 flex gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={`w-36 cursor-pointer rounded-lg border border-border px-3.5 py-1.5 text-center text-sm font-medium transition-colors ${
              view === tab.id
                ? "bg-brand text-white hover:bg-brand-hover"
                : "bg-surface text-ink hover:bg-surface-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {view === VIEWS.CREATE && <CreateUser />}
        {view === VIEWS.MANAGE && <ManageUsers />}
        {view === VIEWS.OTHER && <div>other</div>}
      </div>
    </div>
  );
};

export default UserOperations;
