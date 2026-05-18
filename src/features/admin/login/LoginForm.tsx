"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth/client";
import { BrandLogo } from "@/features/layout/BrandLogo";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/activities";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn.email({ email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Sign-in failed");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-card border border-border rounded-3xl p-10 shadow-2xl"
    >
      <BrandLogo className="h-14 w-auto aspect-[390/169] text-primary mb-2" />
      <p className="text-muted-foreground mb-8">Admin sign-in</p>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm font-bold">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
        />
      </div>

      {error ? (
        <div className="mb-5 p-3 bg-destructive/10 border border-destructive rounded-xl">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
