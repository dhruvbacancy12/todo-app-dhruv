import TodoItem from "./TodoItem";
import type { Todo } from "@/lib/types";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-neutral-400">
        No tasks yet. Add one above.
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div>
      {pending.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {completed.length > 0 && pending.length > 0 && (
        <div className="flex items-center gap-3 py-3">
          <div className="flex-1 h-px bg-neutral-100" />
          <span className="text-xs text-neutral-400">{completed.length} completed</span>
          <div className="flex-1 h-px bg-neutral-100" />
        </div>
      )}
      {completed.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
