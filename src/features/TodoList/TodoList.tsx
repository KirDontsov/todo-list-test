import { useFieldArray, useFormContext } from "react-hook-form";
import { useCallback, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUnit } from "effector-react";
import uniqueId from "lodash-es/uniqueId";
import cn from "classnames";
import {
  $todos,
  addTodoEvt,
  deleteAllFinishedTodoEvt,
  deleteTodoEvt,
  updateFinishedTodoEvt,
  updateValueTodoEvt,
} from "../../entities";
import { TodoItem } from "../TodoItem";
import type { Maybe, TodoDTO } from "../../shared";
import { ButtonWithTooltip, AddItem, TrashIcon } from "../../widgets";

import "./styles.css";

export const TodoList = () => {
  const { pathname: route } = useLocation();
  const {
    todos,
    addTodo,
    updateValueTodo,
    updateFinishedTodo,
    deleteTodo,
    deleteAllFinishedTodo,
  } = useUnit({
    todos: $todos,
    addTodo: addTodoEvt,
    updateValueTodo: updateValueTodoEvt,
    updateFinishedTodo: updateFinishedTodoEvt,
    deleteTodo: deleteTodoEvt,
    deleteAllFinishedTodo: deleteAllFinishedTodoEvt,
  });
  const { control } = useFormContext<{ todos: TodoDTO[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "todos",
    keyName: "key",
  });
  const countRef = useRef<number | null>(0);
  const elemRef = useRef<Maybe<HTMLDivElement>>(null);

  const handleAddTodo = useCallback(
    (value: string) => {
      countRef.current = countRef.current ? countRef.current + 1 : 1;
      const newTodo = {
        id: `${fields.length ? `new_${Number(fields[fields.length - 1]?.id?.split("_")?.[1]) + 1}` : uniqueId("new_")}`,
        title: value,
        finished: false,
      };
      append(newTodo, { shouldFocus: false });
      addTodo(newTodo);
    },
    [addTodo, append, fields],
  );

  useLayoutEffect(() => {
    const elem = elemRef.current;
    if (elem) {
      if (countRef.current) {
        elem.classList.add("new");
        const timeout = setTimeout(() => elem.classList.remove("new"), 300);
        return () => {
          clearTimeout(timeout);
          countRef.current = null;
        };
      }
    }
  }, [fields]);

  const handleChangeInput = (id: string, value: string) => {
    updateValueTodo({ id, value });
  };

  const handleChangeFinished = (id: string, value: boolean) => {
    updateFinishedTodo({ id, value });
  };

  const handleDeleteTodo = (id: string, index: number) => {
    remove(index);
    deleteTodo(id);
  };

  const handleDeleteFinishedTodo = () => {
    const indexesToDelete: number[] = [];
    todos.forEach((todo, index) => {
      if (todo.finished) {
        indexesToDelete.push(index);
      }
    });
    remove(indexesToDelete);
    deleteAllFinishedTodo();
  };

  return (
    <div className="flex flex-col gap-2">
      <AddItem onAddTodo={handleAddTodo} />
      <div className="flex flex-col items-center justify-center gap-2">
        {fields.map((item, index) => (
          <TodoItem
            key={item.id}
            item={item}
            elemRef={elemRef}
            finisfhed={todos.find((x) => x.id === item.id)?.finished ?? false}
            index={index}
            onChangeFinished={handleChangeFinished}
            onChangeInput={handleChangeInput}
            onDeleteTodo={handleDeleteTodo}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div>Осталось: {todos?.filter((x) => !x.finished)?.length ?? 0}</div>
        <div className="flex items-center justify-center gap-2">
          <Link
            to="/"
            className="py-2.5 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Все
          </Link>
          <Link
            to="/active"
            className={cn(
              "py-2.5 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
              {
                "": route === "/active",
              },
            )}
          >
            Не завершенные
          </Link>
          <Link
            to="/finished"
            className="py-2.5 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Завершенные
          </Link>
        </div>
        <ButtonWithTooltip
          hint="Удалить все завершенные"
          onClick={handleDeleteFinishedTodo}
        >
          <TrashIcon />
        </ButtonWithTooltip>
      </div>
    </div>
  );
};
