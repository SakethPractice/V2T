import { translate } from "../../i18n/translate";
import { useLanguage } from "../../hooks/useLanguage";
import { Translation } from "../../types/language";

interface OptionButtonsProps {
  name: string;
  options: Translation[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function OptionButtons({
  name,
  options,
  value,
  onChange,
  disabled = false,
  className = "",
}: OptionButtonsProps) {
  const { language } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      className={`grid gap-3 sm:grid-cols-2 ${className}`}
    >
      {options.map((option, index) => {
        const optionValue = option.en;
        const checked = value === optionValue;
        const id = `${name}-${index}`;

        return (
          <label
            key={optionValue}
            htmlFor={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              checked
                ? "border-blue-600 bg-blue-50"
                : "border-slate-300 bg-white hover:bg-slate-50"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(optionValue)}
              className="h-4 w-4 accent-blue-600"
            />

            <span className="text-slate-700">
              {translate(option, language)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
