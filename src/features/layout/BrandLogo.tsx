type BrandLogoProps = {
  className?: string;
  ariaLabel?: string;
};

export const BrandLogo = ({
  className = "h-8 w-auto aspect-[390/169] text-primary",
  ariaLabel = "Peja Fest",
}: BrandLogoProps) => {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: "url(/logo.svg)",
        maskImage: "url(/logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
};
