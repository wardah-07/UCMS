import { useState } from "react";
import { CreateUser, ManageUsers } from "@/features/users";

const tabClasses = (isActive: boolean) =>
  `w-36 cursor-pointer rounded-lg border border-border px-3.5 py-1.5 text-center text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand text-white hover:bg-brand-hover"
      : "bg-surface text-ink hover:bg-surface-muted"
  }`;

const UserOperations = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold tracking-wide text-ink uppercase">
        User operations
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Create and manage user accounts for the university system.
      </p>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className={tabClasses(!isCreating)}
        >
          Manage
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className={tabClasses(isCreating)}
        >
          Create
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {isCreating ? <CreateUser /> : <ManageUsers />}
      </div>
    </div>
  );
};

export default UserOperations;
