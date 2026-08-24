import type { Club } from "@ucms/shared";
import { getErrorMessage } from "@/lib/apiClient";

type ClubListProps = {
  clubs: Club[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  emptyMessage: string;
};

const ClubList = ({
  clubs,
  isLoading,
  isError,
  error,
  emptyMessage,
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
          {clubs.map((club) => (
            <li
              key={club.id}
              className="rounded-xl border border-border bg-surface-muted p-4 shadow-sm"
            >
              <h3 className="font-semibold text-ink">{club.name}</h3>
              {club.description && (
                <p className="mt-1 text-sm text-ink-soft">
                  {club.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClubList;
