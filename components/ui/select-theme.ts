import type { GroupBase, StylesConfig } from "react-select";

export function themedSelectStyles<
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(): StylesConfig<Option, IsMulti, Group> {
  return {
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
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "var(--hc-border)",
    }),
    dropdownIndicator: (base) => ({ ...base, color: "var(--hc-text-3)" }),
    clearIndicator: (base) => ({ ...base, color: "var(--hc-text-3)" }),
  };
}
