export const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="1" y="6" width="14" height="10" rx="1" />
      <path d="M15 9h4l3 4v3h-7M5.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM18.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
  );
};
