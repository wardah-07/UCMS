import { useState } from "react";
import { useGetMyClubs, useDeleteClub, useUpdateClub } from "./queries";
import ClubList from "./ClubList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getErrorMessage } from "@/lib/apiClient";
import type { Club, ClubUpdateInput } from "@ucms/shared";

const MyClubs = () => {
  const { data: clubs, isError, error, isLoading } = useGetMyClubs();
  const deleteClub = useDeleteClub();
  const updateClub = useUpdateClub();
  const [pendingClub, setPendingClub] = useState<Club | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null); // id of the club currently in edit mode
  const [editDraft, setEditDraft] = useState<ClubUpdateInput>({
    name: "",
    description: "",
  });

  function handleConfirmDelete() {
    if (!pendingClub) return;
    deleteClub.mutate(pendingClub.id, {
      onSettled: () => setPendingClub(null),
    });
  }

  function startEdit(club: Club) {
    setEditingId(club.id);
    setEditDraft({ name: club.name, description: club.description ?? "" });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: number) {
    updateClub.mutate(
      { id, data: editDraft },
      { onSuccess: () => setEditingId(null) },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ClubList
        clubs={clubs}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyMessage="You don't manage any clubs yet."
        onDeleteClub={setPendingClub}
        editingClubId={editingId}
        editDraft={editDraft}
        onEditDraftChange={setEditDraft}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        isSaving={updateClub.isPending}
      />

      {updateClub.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(updateClub.error)}
        </p>
      )}

      {deleteClub.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(deleteClub.error)}
        </p>
      )}

      <ConfirmDialog
        open={pendingClub !== null}
        title={`Delete ${pendingClub?.name}?`}
        description="This will permanently delete the club along with its memberships and events."
        confirmLabel="Delete"
        isLoading={deleteClub.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingClub(null)}
      />
    </div>
  );
};

export default MyClubs;
