import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@ucms/shared";
import { useNavigate } from "react-router";
import { useRegister } from "./queries";
import { getErrorMessage } from "@/lib/apiClient";
import { ROUTES } from "@/constants/routes";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data) {
    registerUser.mutate(data, {
      onSuccess: () => navigate(ROUTES.AUTH, { replace: true }),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <input
          {...register("name")}
          placeholder="Name"
          className="rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {errors.name && (
          <p className="text-sm text-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          {...register("email")}
          placeholder="Email"
          className="rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {errors.email && (
          <p className="text-sm text-danger">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {errors.password && (
          <p className="text-sm text-danger">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={registerUser.isPending}
        className="mt-1 cursor-pointer rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {registerUser.isPending ? "Registering..." : "Register"}
      </button>
      {registerUser.isError && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {getErrorMessage(registerUser.error)}
        </p>
      )}
    </form>
  );
}
