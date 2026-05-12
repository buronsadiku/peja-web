import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const AdminLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
};
