"use client";

import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

import { cn } from "@/lib/utils";

import { themedSelectStyles } from "./select-theme";

interface Option {
  value: string;
  label: string;
}

interface AdvancedSelectProps {
  name: string;
  value: Option | null;
  onChange: (value: string) => void;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  placeholder?: string;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function AdvancedSelect({
  name,
  value,
  onChange,
  loadOptions,
  placeholder = "Select an option",
  isSearchable = true,
  disabled = false,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: AdvancedSelectProps) {
  return (
    <AsyncSelect
      name={name}
      inputId={id}
      instanceId={id}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      value={value}
      onChange={(selected: SingleValue<Option>) =>
        onChange(selected?.value || "")
      }
      loadOptions={loadOptions}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={disabled}
      defaultOptions
      cacheOptions
      styles={themedSelectStyles<Option, false>()}
      className={cn("focus-visible:outline-hidden", className)}
    />
  );
}
