import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@ucms/shared";
import { useNavigate } from "react-router";
import { useRegister } from "./queries";
import { getErrorMessage } from "../../lib/apiClient";
import { ROUTES } from "../../constants/routes";

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
      onSuccess: () => navigate(ROUTES.HOME, { replace: true }),
    });
  }

  return (
    <div>
      <h2>Register form:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input {...register("name")} placeholder="Name" />
        {errors.name && <p>{errors.name.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={registerUser.isPending}>
          {registerUser.isPending ? "Registering..." : "Register"}
        </button>
        {registerUser.isError && <p>{getErrorMessage(registerUser.error)}</p>}
      </form>
    </div>
  );
}
