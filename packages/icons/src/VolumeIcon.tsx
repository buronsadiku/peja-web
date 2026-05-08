export const VolumeIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
      <path d="M11 5L6 9H2v6h4l5 4z" />
      <path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12" />
    </svg>
  );
};
