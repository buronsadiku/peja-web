import { CheckIcon } from "@peja/icons/CheckIcon";

export const CoverSelectedBadge = () => (
  <div className="bg-primary absolute top-2 right-2 flex size-6 items-center justify-center rounded-full shadow-md">
    <CheckIcon
      width={13}
      height={13}
      className="text-primary-foreground"
      strokeWidth={3}
    />
  </div>
);
