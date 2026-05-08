import { SignUpHeader } from "./SignUpHeader";

export const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <SignUpHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
};
