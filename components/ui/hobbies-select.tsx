"use client";

import CreatableSelect from "react-select/creatable";

import { cn } from "@/lib/utils";

// Predefined hobbies relevant for hackathon participants
export const PREDEFINED_HOBBIES = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "AI/Machine Learning",
  "Cybersecurity",
  "Blockchain",
  "Game Development",
  "Robotics",
  "Data Science",
  "IoT",
  "UI/UX Design",
  "Digital Art",
  "3D Modeling",
  "Gaming",
  "Esports",
  "Entrepreneurship",
  "Startups",
  "Problem Solving",
  "Competitive Programming",
  "Mentoring",
  "Open Source",
  "Tech Communities",
  "Music",
  "Photography",
  "Reading",
  "Writing",
  "Sports",
  "Travel",
];

interface Option {
  value: string;
  label: string;
}

interface HobbiesSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function HobbiesSelect({
  value,
  onChange,
  disabled = false,
  className,
}: HobbiesSelectProps) {
  const selected = value
    ? value.split(",").map((hobby) => ({ value: hobby, label: hobby }))
    : [];

  const predefinedOptions = PREDEFINED_HOBBIES.map((hobby) => ({
    value: hobby,
    label: hobby,
  }));

  const handleChange = (newValue: readonly Option[]) => {
    if (Array.isArray(newValue) && newValue.length <= 5) {
      const values = newValue.map((item) => item.value);
      onChange(values.join(","));
    }
  };

  return (
    <CreatableSelect
      isMulti
      name="hobbies"
      value={selected}
      onChange={handleChange}
      options={predefinedOptions}
      isDisabled={disabled}
      placeholder="Select or add new..."
      noOptionsMessage={() => "Type to create a new hobby"}
      isSearchable
      isClearable
      classNames={{
        control: () => "min-h-[40px]!",
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "8px",
          borderColor: state.isFocused ? "var(--hc-primary)" : "var(--hc-border)",
          backgroundColor: "var(--hc-surface)",
          boxShadow: "none",
          "&:hover": { borderColor: "var(--hc-primary)" },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--hc-surface)",
          border: "1px solid var(--hc-border)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          zIndex: 50,
        }),
        input: (base) => ({ ...base, color: "var(--hc-text)" }),
        singleValue: (base) => ({ ...base, color: "var(--hc-text)" }),
        placeholder: (base) => ({ ...base, color: "var(--hc-text-3)" }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "var(--hc-primary)"
            : state.isFocused
              ? "var(--hc-brand-soft)"
              : "transparent",
          color: state.isSelected ? "#ffffff" : "var(--hc-text)",
          "&:active": { backgroundColor: "var(--hc-brand-soft)" },
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "var(--hc-brand-soft)",
          borderRadius: "6px",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "var(--hc-text)",
          padding: "2px 6px",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "var(--hc-text-2)",
          "&:hover": { backgroundColor: "#dc2626", color: "white" },
        }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: "var(--hc-border)" }),
        dropdownIndicator: (base) => ({ ...base, color: "var(--hc-text-3)" }),
        clearIndicator: (base) => ({ ...base, color: "var(--hc-text-3)" }),
      }}
      className={cn(
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        className,
      )}
    />
  );
}
