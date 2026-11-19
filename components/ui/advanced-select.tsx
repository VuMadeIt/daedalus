"use client";

import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

import { cn } from "@/lib/utils";

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
      styles={{
        control: (base, state) => ({
          ...base,
          height: "40px",
          borderRadius: "6px",
          borderColor: state.isFocused ? "rgba(210, 102, 102, 0.6)" : "#e5e7eb",
          background: "#ffffff",
          boxShadow: state.isFocused ? "0 0 0 2px rgba(210, 102, 102, 0.2)" : "none",
          cursor: "pointer",
          "&:hover": {
            borderColor: "rgba(0, 0, 0, 0.15)",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        }),
        menuList: (base) => ({
          ...base,
          padding: "4px",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#77777c",
        }),
        input: (base) => ({
          ...base,
          color: "#292a27",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected 
            ? "#f5ecec" 
            : state.isFocused 
              ? "#f4f4ef" 
              : "transparent",
          color: state.isSelected ? "#292a27" : "#414146",
          cursor: "pointer",
          borderRadius: "4px",
          "&:active": {
            backgroundColor: "#f5ecec",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#292a27",
        }),
        noOptionsMessage: (base) => ({
          ...base,
          color: "#77777c",
        }),
        loadingMessage: (base) => ({
          ...base,
          color: "#77777c",
        }),
      }}
      className={cn(
        "focus-visible:outline-hidden",
        className,
      )}
    />
  );
}
