import { $todos } from "../entities";
import { useUnit } from "effector-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { TodoList } from "../features";
import { useLocation } from "react-router-dom";
import type { TodoDTO } from "../shared";

function App() {
  const { pathname: route } = useLocation();
  const { todos } = useUnit({
    todos: $todos,
  });

  const visibleTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (route === "/active") return !todo.finished;

        if (route === "/finished") return todo.finished;

        return todo;
      }),
    [todos, route],
  );

  const form = useForm<{ todos: TodoDTO[] }>({
    mode: "onChange",
    defaultValues: {
      todos: visibleTodos ?? [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({ todos: visibleTodos });
  }, [reset, route, visibleTodos]);

  return (
    <div className="flex flex-col gap-8">
      <h1>Todo List</h1>
      <FormProvider {...form}>
        <TodoList />
      </FormProvider>
    </div>
  );
}

export default App;
