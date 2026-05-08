type LoaderDotProps = {
  color: string;
  active: boolean;
};

export const LoaderDot = ({ color, active }: LoaderDotProps) => (
  <span
    className="size-2.5 rounded-full transition-opacity"
    style={{ background: color, opacity: active ? 1 : 0.4 }}
  />
);
