import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function InputLabeled({
  label = null,
  placeholder,
  setValue,
  name,
  value,
  id,
}: {
  label: string | null;
  placeholder: string;
  value: string;
  name: string | null;
  id: string | null;
  setValue: string | Record<string, string | number>;
}) {
  const InputId = id;
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (name) {
      setValue((prev: Record<string, string | number>) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValue(newValue);
    }
  };
  return (
    <div>
      {label && <Label htmlFor={InputId}>{label}</Label>}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        id={InputId}
      />
    </div>
  );
}
