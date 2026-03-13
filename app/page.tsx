import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import AddTodoForm from "@/components/todos/AddTodoForm";
import TodoList from "@/components/todos/TodoList";
import type { Todo } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const pending = (todos ?? []).filter((t: Todo) => !t.completed).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight">Todos</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold">
            {pending > 0 ? `${pending} task${pending > 1 ? "s" : ""} left` : "All done!"}
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">{user.email}</p>
        </div>

        {/* Add todo */}
        <AddTodoForm />

        {/* List */}
        <TodoList todos={(todos ?? []) as Todo[]} />
      </main>
    </div>
  );
}
