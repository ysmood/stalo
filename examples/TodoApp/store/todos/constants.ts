export const initTodo = {
  id: Date.now(),
  text: "",
  done: false,
};

export type Todos = (typeof initTodo)[];
