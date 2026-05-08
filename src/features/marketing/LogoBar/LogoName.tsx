type LogoNameProps = {
  name: string;
};

export const LogoName = ({ name }: LogoNameProps) => (
  <span className="text-foreground type-h3 font-medium tracking-tight">
    {name}
  </span>
);
