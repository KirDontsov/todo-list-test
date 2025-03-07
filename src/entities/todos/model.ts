import { createEvent, createStore, sample } from "effector";
import { produce } from "immer";
import { debug } from "patronum";
import { persist } from "effector-storage/local";
import { TodoDTO } from "../../shared";

export const $todos = createStore<TodoDTO[]>([]);
persist({ store: $todos, key: "todos" });

export const addTodoEvt = createEvent<TodoDTO>();
export const updateValueTodoEvt = createEvent<{ id: string; value: string }>();
export const updateFinishedTodoEvt = createEvent<{
  id: string;
  value: boolean;
}>();
export const deleteTodoEvt = createEvent<string>();
export const deleteAllFinishedTodoEvt = createEvent();

sample({
  clock: addTodoEvt,
  source: $todos,
  fn: (s, c) => {
    return produce(s, (draft) => {
      draft.push(c);
    });
  },
  target: $todos,
});

sample({
  clock: updateValueTodoEvt,
  source: $todos,
  fn: (s, c) => {
    return produce(s, (draft) => {
      const index = draft.findIndex((todo) => todo.id === c.id);
      if (index !== -1) {
        draft[index] = {
          ...draft[index],
          title: c.value,
        };
      } else {
        draft.push({
          id: c.id,
          title: c.value,
          finished: false,
        });
      }
    });
  },
  target: $todos,
});

sample({
  clock: updateFinishedTodoEvt,
  source: $todos,
  fn: (s, c) => {
    return produce(s, (draft) => {
      const index = draft.findIndex((todo) => todo.id === c.id);
      if (index !== -1) {
        draft[index] = {
          ...draft[index],
          finished: c.value,
        };
      }
    });
  },
  target: $todos,
});

sample({
  clock: deleteTodoEvt,
  source: $todos,
  fn: (s, c) => {
    return produce(s, (draft) => {
      const index = draft.findIndex((todo) => todo.id === c);
      if (index !== -1) draft.splice(index, 1);
    });
  },
  target: $todos,
});

sample({
  clock: deleteAllFinishedTodoEvt,
  source: $todos,
  fn: (s) => s.filter((todo) => !todo.finished),
  target: $todos,
});

debug($todos);
