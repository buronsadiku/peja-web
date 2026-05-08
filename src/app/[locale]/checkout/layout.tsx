const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      {/* TODO: Progress bar */}
      {children}
    </div>
  );
};

export default CheckoutLayout;
