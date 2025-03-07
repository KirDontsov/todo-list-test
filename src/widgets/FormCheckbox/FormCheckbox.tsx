import { useController, useFormContext } from "react-hook-form";
import { type ChangeEvent, type FC, useCallback } from "react";

export interface FormCheckboxProps {
  id: string;
  name: string;
  onCustomChange: (id: string, value: boolean) => void;
}

export const FormCheckbox: FC<FormCheckboxProps> = ({
  id,
  name,
  onCustomChange,
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ref },
  } = useController({ control, name });

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const value = target.checked;
      onChange(value);
      onCustomChange(id, value);
    },
    [id, onChange, onCustomChange],
  );

  return (
    <input
      ref={ref}
      id="default-checkbox"
      type="checkbox"
      checked={value}
      onChange={handleChange}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
    />
  );
};
