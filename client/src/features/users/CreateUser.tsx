import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreationSchema } from "@ucms/shared";
import { getErrorMessage } from "@/lib/apiClient";
import { useCreateUser } from "./queries";
import type { UserCreationInput } from "@ucms/shared";

const ROLES = [
  { id: "admin", value: "ADMIN", label: "ADMIN" },
  { id: "organizer", value: "ORGANIZER", label: "ORGANIZER" },
  { id: "student", value: "STUDENT", label: "STUDENT" },
];

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const CreateUser = () => {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(userCreationSchema) });

  function onSubmit(data: UserCreationInput) {
    createUser.mutate(data, { onSuccess: () => reset() });
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
          placeholder="Jhon Doe"
          required
          className={inputClasses}
        />
        {errors.name && (
          <p className="text-sm text-danger">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          {...register("email")}
          type="email"
          placeholder="example@gmail.com"
          required
          className={inputClasses}
        />
        {errors.email && (
          <p className="text-sm text-danger">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          {...register("password")}
          type="password"
          placeholder="********"
          required
          className={inputClasses}
        />
        {errors.password && (
          <p className="text-sm text-danger">{errors.password.message}</p>
        )}
      </div>

      <fieldset className="rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-medium text-ink-soft">Role</legend>
        <div className="flex flex-col gap-2">
          {ROLES.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                id={role.id}
                value={role.value}
                className={`size-4 cursor-pointer ${
                  role.id === "admin"
                    ? "accent-danger"
                    : role.id === "organizer"
                      ? "accent-success"
                      : "accent-brand"
                }`}
              />
              <label
                htmlFor={role.id}
                className="cursor-pointer text-sm text-ink"
              >
                {role.label}
              </label>
            </div>
          ))}
        </div>
        {errors.role && (
          <p className="mt-2 text-sm text-danger">{errors.role.message}</p>
        )}
      </fieldset>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
      >
        Create
      </button>
      {createUser.isSuccess && (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
          User created successfully.
        </p>
      )}
      {createUser.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(createUser.error)}
        </p>
      )}
    </form>
  );
};

export default CreateUser;
