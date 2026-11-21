"use client";

import Select from "react-select";

import { cn } from "@/lib/utils";
import { AVAILABLE_SKILLS } from "@/lib/validations/profile";

import { themedSelectStyles } from "./select-theme";

interface Option {
  value: string;
  label: string;
}

interface SkillsSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function SkillsSelect({
  value,
  onChange,
  disabled = false,
  className,
}: SkillsSelectProps) {
  const selected = value
    ? value.map((skill) => ({ value: skill, label: skill }))
    : [];

  const skillOptions = AVAILABLE_SKILLS.map((skill) => ({
    value: skill,
    label: skill,
  }));

  const handleChange = (newValue: readonly Option[]) => {
    if (Array.isArray(newValue) && newValue.length <= 8) {
      const values = newValue.map((item) => item.value);
      onChange(values);
    }
  };

  return (
    <Select
      isMulti
      instanceId="skills"
      name="skills"
      value={selected}
      onChange={handleChange}
      options={skillOptions}
      isDisabled={disabled}
      placeholder="Select your skills..."
      noOptionsMessage={() => "No skills found"}
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
