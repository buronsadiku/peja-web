export const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M20 12v9H4v-9M7.5 8a2.5 2.5 0 1 1 0-5c2 0 3 1.5 4.5 5C13.5 4.5 14.5 3 16.5 3a2.5 2.5 0 1 1 0 5" />
    </svg>
  );
};
