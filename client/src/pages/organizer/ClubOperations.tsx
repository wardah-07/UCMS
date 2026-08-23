import { CreateClub } from "@/features/clubs";

const ClubOperations = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Club operations
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Create and manage the clubs you run.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Create a club</h2>
        <p className="mt-1 text-sm text-ink-soft">
          You'll be added as the club's manager automatically.
        </p>
        <div className="mt-4">
          <CreateClub />
        </div>
      </div>
    </div>
  );
};

export default ClubOperations;
