import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";

export interface AddItemProps {
  onAddTodo: (value: string) => void;
}

export const AddItem: FC<AddItemProps> = ({ onAddTodo }) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // @ts-expect-error error
        const value = e.target.value.trim();
        onAddTodo(value);
        setValue("");
      }
    },
    [onAddTodo],
  );

  return (
    <input
      onKeyDown={handleKeyDown}
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Что нужно сделать?"
    />
  );
};
