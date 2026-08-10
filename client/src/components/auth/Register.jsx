import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "../../lib/apiClient";

const registerFormSchema = z.object({
  email: z.string().trim().email("invalid email format"),
  name: z.string().trim().min(3, "name cannot be less than 3 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
  });

  async function onSubmit(data) {
    try {
      await apiClient.post("/auth/register", data);
      // navigate to login, or auto-login, your call
    } catch (err) {
      // handle server-side error (e.g. duplicate email 409)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("name")} placeholder="Name" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
