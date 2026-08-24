import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clubCreationSchema } from "@ucms/shared";
import { getErrorMessage } from "@/lib/apiClient";
import { useCreateClub } from "./queries";
import type { ClubCreationInput } from "@ucms/shared";

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

type CreateClubProps = {
  onCreated?: () => void;
};

const CreateClub = ({ onCreated }: CreateClubProps) => {
  const createClub = useCreateClub();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clubCreationSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(data: ClubCreationInput) {
    createClub.mutate(data, {
      onSuccess: () => {
        reset();
        onCreated?.();
      },
    });
  }

  return (
    <form
      className="flex max-w-sm flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1.5">
        <input
          {...register("name")}
          type="text"
          placeholder="Chess Club"
          required
          className={inputClasses}
        />
        {errors.name && (
          <p className="text-sm text-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <textarea
          {...register("description")}
          placeholder="What does this club do?"
          rows={4}
          className={inputClasses}
        />
        {errors.description && (
          <p className="text-sm text-danger">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={createClub.isPending}
        className="cursor-pointer rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createClub.isPending ? "Creating…" : "Create"}
      </button>
      {createClub.isSuccess && (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
          Club created successfully.
        </p>
      )}
      {createClub.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(createClub.error)}
        </p>
      )}
    </form>
  );
};

export default CreateClub;
