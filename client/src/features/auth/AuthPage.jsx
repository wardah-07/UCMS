import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthPage() {
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
