import { useState } from "react";
import { useGetUsers, useUpdateUser } from "./queries";
import { useCurrentUser } from "@/features/auth";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getErrorMessage } from "@/lib/apiClient";
import { roleSchema } from "@ucms/shared";

const ROLE_OPTIONS = roleSchema.options; // ["ADMIN", "ORGANIZER", "STUDENT"]

const ROLE_BADGE_CLASSES = {
  ADMIN: "bg-danger-soft text-danger",
  ORGANIZER: "bg-success-soft text-success",
  STUDENT: "bg-brand-soft text-brand",
};

const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      ROLE_BADGE_CLASSES[role] ?? "bg-surface-muted text-ink-soft"
    }`}
  >
    {role}
  </span>
);

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      isActive
        ? "bg-success-soft text-success"
        : "bg-surface-muted text-ink-soft"
    }`}
  >
    {isActive ? "Active" : "Deactivated"}
  </span>
);

const ManageUsers = () => {
  const { data: users, isError, error, isLoading } = useGetUsers();
  const { data: currentUser } = useCurrentUser();
  const updateUser = useUpdateUser();
  const [pendingUser, setPendingUser] = useState(null); // user targeted by the confirm dialog
  const [editingId, setEditingId] = useState(null); // id of the row currently in edit mode
  const [draft, setDraft] = useState({ name: "", email: "", role: "STUDENT" });

  function startEdit(user) {
    setEditingId(user.id);
    setDraft({ name: user.name, email: user.email, role: user.role });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id) {
    updateUser.mutate(
      { id, updates: draft },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleConfirmToggle() {
    updateUser.mutate(
      { id: pendingUser.id, updates: { isActive: !pendingUser.isActive } },
      { onSettled: () => setPendingUser(null) },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-ink">Manage Users</h2>

      {isLoading && <p className="text-sm text-ink-soft">Loading users…</p>}

      {isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(error)}
        </p>
      )}

      {updateUser.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(updateUser.error)}
        </p>
      )}

      {users && users.length === 0 && (
        <p className="text-sm text-ink-soft">No users yet.</p>
      )}

      {users && users.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-2.5 font-medium text-ink-soft">
                  Name
                </th>
                <th className="w-64 px-4 py-2.5 font-medium text-ink-soft">
                  Email
                </th>
                <th className="w-28 px-4 py-2.5 font-medium text-ink-soft">
                  Role
                </th>
                <th className="px-4 py-2.5 font-medium text-ink-soft">
                  Status
                </th>
                <th className="w-72 whitespace-nowrap px-4 py-2.5 font-medium text-ink-soft">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0"
                >
                  {user.id === editingId ? (
                    <>
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) =>
                            setDraft({ ...draft, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="email"
                          value={draft.email}
                          onChange={(e) =>
                            setDraft({ ...draft, email: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={draft.role}
                          onChange={(e) =>
                            setDraft({ ...draft, role: e.target.value })
                          }
                          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-ink">{user.name}</td>
                      <td
                        className="max-w-64 truncate px-4 py-2.5 text-ink-soft"
                        title={user.email}
                      >
                        {user.email}
                      </td>
                      <td className="px-4 py-2.5">
                        <RoleBadge role={user.role} />
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2.5">
                    <StatusBadge isActive={user.isActive} />
                  </td>
                  <td className="px-4 py-2.5">
                    {user.id === editingId ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="cursor-pointer rounded-lg border border-border px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={updateUser.isPending}
                          onClick={() => saveEdit(user.id)}
                          className="cursor-pointer rounded-lg bg-brand px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updateUser.isPending ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          disabled={user.id === currentUser?.id}
                          title={
                            user.id === currentUser?.id
                              ? "You cannot deactivate your own account"
                              : undefined
                          }
                          onClick={() => setPendingUser(user)}
                          className={`cursor-pointer rounded-lg border border-border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isActive
                              ? "text-danger hover:bg-danger-soft"
                              : "text-success hover:bg-success-soft"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(user)}
                          className="cursor-pointer rounded-lg border border-border px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-muted"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={pendingUser !== null}
        title={
          pendingUser?.isActive
            ? `Deactivate ${pendingUser?.name}?`
            : `Activate ${pendingUser?.name}?`
        }
        description={
          pendingUser?.isActive
            ? "They will no longer be able to log in until reactivated."
            : "They will be able to log in again."
        }
        confirmLabel={pendingUser?.isActive ? "Deactivate" : "Activate"}
        isLoading={updateUser.isPending}
        onConfirm={handleConfirmToggle}
        onCancel={() => setPendingUser(null)}
      />
    </div>
  );
};

export default ManageUsers;
