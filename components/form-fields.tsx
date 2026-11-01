import { ChevronDown, type LucideIcon } from "lucide-react";

// Shared building blocks for the long forms (quote, account setup). Styling
// matches the contact form: white fields with navy borders that turn orange
// on focus, sitting straight on the page background with no panel behind.

export const fieldClass =
  "h-12 w-full rounded-md border-2 border-[#1F447B] bg-white px-4 text-base text-[#324A6D] placeholder:text-[#324A6D]/40 transition-colors focus:border-[#EB993C] focus:outline-none";
export const labelClass = "mb-1 block text-sm font-semibold text-[#1F447B]";
export const questionClass = "mb-3 text-base font-semibold text-[#1F447B]";
export const hintClass = "mt-2 text-xs leading-snug text-[#324A6D]/70";
export const selectedTileClass = "border-[#EB993C] bg-[#FDF5EC]";
export const idleTileClass = "border-[#1F447B] bg-white hover:border-[#EB993C]/60";
// Repeated items (packages, containers, contacts) are grouped by a faint outline, not a fill
export const unitCardClass = "rounded-xl border-2 border-[#1F447B]/15 p-4 sm:p-5";
export const removeButtonClass =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#324A6D]/70 transition-colors hover:bg-[#EB993C]/10 hover:text-[#EB993C]";
export const addButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#1F447B]/30 px-4 py-3 text-sm font-semibold text-[#1F447B] transition-colors hover:border-[#EB993C] hover:text-[#EB993C]";
export const submitButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-[#1F447B] bg-[#EB993C] px-10 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#d4822a] hover:shadow-xl sm:w-auto";
export const checkboxClass = "h-5 w-5 shrink-0 accent-[#EB993C]";

// A select and an input sharing one bordered box (phone prefix + number, etc.)
export const joinedFieldClass =
  "flex h-12 overflow-hidden rounded-md border-2 border-[#1F447B] bg-white transition-colors focus-within:border-[#EB993C]";
export const joinedInputClass =
  "min-w-0 flex-1 bg-white px-4 text-base text-[#324A6D] placeholder:text-[#324A6D]/40 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#9aa5b1]";

// Track and knob of an on/off switch; follows a `peer sr-only` checkbox
export const switchTrackClass =
  "relative h-6 w-11 shrink-0 rounded-full bg-[#1F447B]/25 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-[#EB993C] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#EB993C] peer-focus-visible:ring-offset-2";

/** Red asterisk for required fields, as on the contact form */
export function Required() {
  return <span className="text-[#E53935]">*</span>;
}

/** One numbered step of a form. From lg up its title sits in a sticky
    column on the left so it stays in view through the longer steps. */
export function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 border-t border-[#1F447B] pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
          Step {step}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#1F447B]">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-[#324A6D]/70">
          {description}
        </p>
      </div>
      <div className="min-w-0 space-y-8">{children}</div>
    </div>
  );
}

export function SelectField({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${fieldClass} appearance-none pr-10 ${className ?? ""}`}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F447B]"
        aria-hidden
      />
    </div>
  );
}

/** The select half of a joined field; goes inside a `joinedFieldClass` box */
export function JoinedSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative shrink-0 border-r-2 border-[#1F447B]">
      <select
        {...props}
        className={`h-full appearance-none bg-transparent pl-4 pr-9 text-base text-[#324A6D] focus:outline-none ${className ?? ""}`}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F447B]"
        aria-hidden
      />
    </div>
  );
}

export function ChoiceCard({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-full w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors ${
        selected ? selectedTileClass : idleTileClass
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          selected ? "bg-[#EB993C] text-white" : "bg-[#1F447B]/5 text-[#1F447B]"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="block text-base font-semibold text-[#1F447B]">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-snug text-[#324A6D]/80">
          {description}
        </span>
      </span>
    </button>
  );
}

/** A whole-tile switch: clicking anywhere on the tile toggles it. */
export function OptionToggle({
  name,
  checked,
  onChange,
  title,
  description,
  note,
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-start justify-between gap-4 rounded-xl border-2 p-4 transition-colors ${
        checked ? selectedTileClass : idleTileClass
      }`}
    >
      <span>
        <span className="block text-sm font-semibold text-[#1F447B]">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-snug text-[#324A6D]/70">
          {description}
        </span>
        {note && (
          <span className="mt-2 block text-xs leading-snug text-[#324A6D]/70">
            {note}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span aria-hidden className={`mt-0.5 ${switchTrackClass}`} />
    </label>
  );
}

export function SegmentedControl({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p id={`${name}-label`} className={labelClass}>
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        className="inline-flex rounded-lg border-2 border-[#1F447B] bg-white p-1"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#EB993C] ${
              value === option.value
                ? "bg-[#1F447B] text-white"
                : "text-[#324A6D] hover:text-[#1F447B]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
