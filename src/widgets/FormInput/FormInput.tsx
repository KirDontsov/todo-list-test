import { type ChangeEvent, type FC, useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";
import cn from "classnames";

export interface FormInputProps {
  id: string;
  name: string;
  finished: boolean;
  onCustomChange: (id: string, value: string) => void;
}

export const FormInput: FC<FormInputProps> = ({
  id,
  name,
  finished,
  onCustomChange,
}) => {
  const { control } = useFormContext();
  const { field: todo } = useController({ control, name });

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      todo.onChange(target.value);
      onCustomChange(id, target.value);
    },
    [todo, onCustomChange, id],
  );

  return (
    <input
      name={todo.name}
      type="text"
      id={todo.value}
      value={todo.value}
      onChange={handleChange}
      disabled={finished}
      className={cn(
        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        {
          "line-through cursor-not-allowed": finished,
        },
      )}
      placeholder="John"
      required
    />
  );
};
