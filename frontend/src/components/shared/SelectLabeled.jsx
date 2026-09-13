import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export default function SelectLabeled({
  label,
  value,
  id,
  placeholder,
  required = false,
  options = [],
  setValue,
  onChange,
}) {
  const handleChange = (newValue) => {
    if (id) {
      setValue?.((prev) => ({
        ...prev,
        [id]: newValue,
      }));
    } else {
      setValue?.(newValue);
    }

    onChange?.(newValue);
  };

  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select value={value} onValueChange={handleChange} required={required}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
