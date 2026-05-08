type ProductTagProps = {
  label: string;
  dark: boolean;
};

export const ProductTag = ({ label, dark }: ProductTagProps) => (
  <span
    className="type-overline absolute top-3 left-3 rounded-full px-2.5 py-1 tracking-[1.5px]"
    style={{
      background: "rgba(0,0,0,0.2)",
      color: dark ? "#fff" : "rgba(0,0,0,0.7)",
    }}
  >
    {label}
  </span>
);
