import { useState } from "react";
import { LoginForm, RegisterForm } from "@/features/auth";

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      <h1>Welcome to UCMS registration!</h1>
      <button onClick={() => setShowRegister((v) => !v)}>
        {showRegister ? "Go to Login" : "Go to Register"}
      </button>
      {showRegister ? <RegisterForm /> : <LoginForm />}
    </div>
  );
}
