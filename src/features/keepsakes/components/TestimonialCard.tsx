import { StarIcon } from "@peja/icons/StarIcon";

type TestimonialCardProps = {
  quote: string;
  couple: string;
  location: string;
};

export const TestimonialCard = ({
  quote,
  couple,
  location,
}: TestimonialCardProps) => (
  <div className="relative">
    <div className="mb-2.5 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          width={12}
          height={12}
          fill="var(--accent)"
          stroke="none"
        />
      ))}
    </div>
    <p className="type-body font-serif leading-snug italic">
      &ldquo;{quote}&rdquo;
    </p>
    <p className="type-caption text-background/60 mt-2">
      {couple} &middot; {location}
    </p>
  </div>
);
