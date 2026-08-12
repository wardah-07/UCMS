import { useState } from "react";
import { LoginForm, RegisterForm } from "@/features/auth";

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold tracking-tight text-ink">
          Welcome to UCMS
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          {showRegister
            ? "Create an account to get started."
            : "Sign in to continue."}
        </p>

        <div className="mt-6">
          {showRegister ? (
            <RegisterForm onSuccess={() => setShowRegister(false)} />
          ) : (
            <LoginForm />
          )}
        </div>

        <button
          onClick={() => setShowRegister((v) => !v)}
          className="mt-5 w-full cursor-pointer text-center text-sm font-medium text-brand hover:text-brand-hover"
        >
          {showRegister
            ? "Already have an account? Log in"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
}
