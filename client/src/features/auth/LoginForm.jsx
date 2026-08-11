import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@ucms/shared";
import { useNavigate } from "react-router";
import { useLogin } from "./queries";
import { getErrorMessage } from "../../lib/apiClient";
import { getHomeRouteForRole } from "../../util/getHomeRouteForRole";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data) {
    login.mutate(data, {
      onSuccess: (user) =>
        navigate(getHomeRouteForRole(user.role), { replace: true }),
    });
  }

  return (
    <div>
      <h2>Login form:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={login.isPending}>
          {login.isPending ? "Logging in..." : "Login"}
        </button>
        {login.isError && <p>{getErrorMessage(login.error)}</p>}
      </form>
    </div>
  );
}
