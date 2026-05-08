import { Input } from "@peja/ui/components/Input";

type AddressFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  placeholder?: string;
};

export const AddressField = ({
  label,
  value,
  onChange,
  help,
  placeholder,
}: AddressFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="type-overline text-muted-foreground font-semibold tracking-wider">
      {label}
    </label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {help && <p className="type-caption text-muted-foreground">{help}</p>}
  </div>
);
