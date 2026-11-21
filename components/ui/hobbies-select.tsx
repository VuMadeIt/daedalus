"use client";

import CreatableSelect from "react-select/creatable";

import { cn } from "@/lib/utils";

import { themedSelectStyles } from "./select-theme";

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
      instanceId="hobbies"
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
      styles={themedSelectStyles<Option, true>()}
      className={cn(
        "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
        className,
      )}
    />
  );
}
