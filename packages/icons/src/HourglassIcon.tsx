export const HourglassIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
      <path d="M6 3h12M6 21h12M6 3v4a6 6 0 0 0 12 0V3M6 21v-4a6 6 0 0 1 12 0v4" />
    </svg>
  );
};
