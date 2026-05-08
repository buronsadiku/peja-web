export const AirDropIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 17a9 9 0 0 1 18 0" />
      <path d="M7 17a5 5 0 0 1 10 0" />
      <path d="M11 17a1 1 0 0 1 2 0" />
      <path d="M9 9l3-3 3 3" />
      <path d="M12 6v6" />
    </svg>
  );
};
