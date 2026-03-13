"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toggleTodo, updateTodo, deleteTodo } from "@/app/actions/todos";
import type { Todo } from "@/lib/types";

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => { await toggleTodo(todo.id, checked); });
  }

  function handleDelete() {
    startTransition(async () => { await deleteTodo(todo.id); });
  }

  function handleEdit() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === todo.title) {
      setIsEditing(false);
      setEditValue(todo.title);
      return;
    }
    startTransition(async () => {
      await updateTodo(todo.id, trimmed);
      setIsEditing(false);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleEdit();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(todo.title);
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 py-3 px-1 border-b border-neutral-100 last:border-0 transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="shrink-0"
      />

      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEdit}
          autoFocus
          className="flex-1 h-7 text-sm border-0 border-b border-neutral-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-neutral-600"
        />
      ) : (
        <span
          className={`flex-1 text-sm cursor-pointer ${
            todo.completed ? "line-through text-neutral-400" : "text-neutral-800"
          }`}
          onDoubleClick={() => !todo.completed && setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            disabled={isPending}
            className="h-7 w-7 p-0 text-neutral-400 hover:text-neutral-700"
          >
            {isEditing ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="h-7 w-7 p-0 text-neutral-400 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </Button>
      </div>
    </div>
  );
}
