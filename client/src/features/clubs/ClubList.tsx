import type { Club, ClubUpdateInput } from "@ucms/shared";
import { getErrorMessage } from "@/lib/apiClient";

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-2.5 py-1 text-sm text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

type ClubListProps = {
  clubs: Club[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  emptyMessage: string;
  // the following are only passed by callers that manage these clubs (e.g.
  // MyClubs) - when omitted, no edit/delete controls are rendered
  onDeleteClub?: (club: Club) => void;
  editingClubId?: number | null;
  editDraft?: ClubUpdateInput;
  onEditDraftChange?: (draft: ClubUpdateInput) => void;
  onStartEdit?: (club: Club) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: number) => void;
  isSaving?: boolean;
};

const ClubList = ({
  clubs,
  isLoading,
  isError,
  error,
  emptyMessage,
  onDeleteClub,
  editingClubId,
  editDraft,
  onEditDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  isSaving,
}: ClubListProps) => {
  return (
    <div>
      {isLoading && <p className="text-sm text-ink-soft">Loading clubs...</p>}

      {isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(error)}
        </p>
      )}

      {clubs && clubs.length === 0 && (
        <p className="text-sm text-ink-soft">{emptyMessage}</p>
      )}

      {clubs && clubs.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => {
            const isEditing = editingClubId === club.id;

            return (
              <li
                key={club.id}
                className="flex flex-col rounded-xl border border-border bg-surface-muted p-4 shadow-sm"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editDraft?.name ?? ""}
                      onChange={(e) =>
                        onEditDraftChange?.({
                          ...editDraft,
                          name: e.target.value,
                        })
                      }
                      className={inputClasses}
                    />
                    <textarea
                      value={editDraft?.description ?? ""}
                      onChange={(e) =>
                        onEditDraftChange?.({
                          ...editDraft,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className={`${inputClasses} resize-none`}
                    />
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={onCancelEdit}
                        className="cursor-pointer rounded-lg border border-border px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => onSaveEdit?.(club.id)}
                        className="cursor-pointer rounded-lg bg-brand px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-ink">{club.name}</h3>
                    {club.description && (
                      <p className="mt-1 text-sm text-ink-soft">
                        {club.description}
                      </p>
                    )}
                    {(onStartEdit || onDeleteClub) && (
                      <div className="mt-3 flex gap-2">
                        {onStartEdit && (
                          <button
                            type="button"
                            onClick={() => onStartEdit(club)}
                            className="cursor-pointer self-start rounded-lg border border-border px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-muted"
                          >
                            Edit
                          </button>
                        )}
                        {onDeleteClub && (
                          <button
                            type="button"
                            onClick={() => onDeleteClub(club)}
                            className="cursor-pointer self-start rounded-lg border border-border px-3 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger-soft"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ClubList;
