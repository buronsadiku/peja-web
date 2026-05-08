const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* TODO: Event-themed header, language picker */}
      <main className="flex-1">{children}</main>
    </>
  );
};

export default GuestLayout;
