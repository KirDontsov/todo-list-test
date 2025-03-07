import { ButtonWithTooltip, FormCheckbox, TrashIcon } from "../../widgets";
import { FormInput } from "../../widgets";
import type { FC, RefObject } from "react";
import type { Maybe } from "../../shared";

export interface TodoItemProps {
  item: { id: string };
  elemRef: RefObject<Maybe<HTMLDivElement>>;
  finisfhed: boolean;
  index: number;
  onChangeFinished: (id: string, value: boolean) => void;
  onChangeInput: (id: string, value: string) => void;
  onDeleteTodo: (id: string, index: number) => void;
}

export const TodoItem: FC<TodoItemProps> = ({
  item,
  elemRef,
  finisfhed,
  index,
  onChangeFinished,
  onChangeInput,
  onDeleteTodo,
}) => {
  const handleDelete = () => {
    onDeleteTodo(item.id, index);
  };

  return (
    <div
      key={item.id}
      ref={elemRef}
      className="relative w-full flex items-center justify-center gap-2 pl-2 py-2 transition duration-300 rounded-xl"
    >
      <FormCheckbox
        id={item.id}
        name={`todos.${index}.finished`}
        onCustomChange={onChangeFinished}
      />
      <FormInput
        id={item.id}
        name={`todos.${index}.title`}
        finished={finisfhed}
        onCustomChange={onChangeInput}
      />
      <ButtonWithTooltip hint="Удалить" onClick={handleDelete}>
        <TrashIcon />
      </ButtonWithTooltip>
    </div>
  );
};
