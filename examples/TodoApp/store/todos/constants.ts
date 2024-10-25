export const initTodo = {
  id: Date.now().toString(),
  text: "",
  done: false,
};

export const initTodos: { [key: string]: typeof initTodo } = {
  [initTodo.id]: initTodo,
};

export type Todos = typeof initTodos;
