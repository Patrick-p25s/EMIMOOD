import { Input } from "@/components/ui/input";
import React, { forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const InputLabeled = forwardRef(function InputLabeled(
  {
    required = false,
    id,
    value,
    setValue,
    onChange, // callback custom optionnel, appelé en plus de setValue
    label = null,
    description = null, // texte d'aide sous le label
    error = null, // message d'erreur, affiché en rouge
    type = "text",
    name = null,
    placeholder = null,
    className = "", // classe du conteneur (div)
    labelClassName = "",
    inputClassName = "",
    disabled = false,
    ...rest // min, max, autoFocus, onBlur, autoComplete, etc.
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (name) {
      setValue?.((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValue?.(newValue);
    }

    onChange?.(e);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Input
        ref={ref}
        type={type}
        value={value ?? ""}
        onChange={handleChange}
        name={name}
        placeholder={placeholder}
        id={inputId}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          inputClassName,
        )}
        {...rest}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export default InputLabeled;
