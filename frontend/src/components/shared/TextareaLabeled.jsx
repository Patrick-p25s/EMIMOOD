import React from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function TextareaLabeled({
  label,
  value,
  row = 5,
  id,
  placeholder,
  required = false,
  setValue,
  onChange,
}) {
  const handleChange = (e) => {
    const newValue = e.target.value;

    if (id) {
      setValue?.((prev) => ({
        ...prev,
        [id]: newValue,
      }));
    } else {
      setValue?.(newValue);
    }

    onChange?.(e);
  };
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={row}
        required={required}
      />
    </div>
  );
}
