"use client";

import { useEffect, useState } from "react";
import TodoItem from "./todo_items";
import TodoModal from "./todo_modal";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const fetchTodos = async () => {
    const res = await fetch("http://127.0.0.1:8000/todos");
    setTodos(await res.json());
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    await fetch("http://127.0.0.1:8000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchTodos();
  };

  const updateTodo = async (title) => {
    await fetch(`http://127.0.0.1:8000/todos/${editTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchTodos();
  };

  return (
    <>
      {/* ADD BUTTON */}
      <button className="add-btn" onClick={() => setOpen(true)}>
        ADD TASK +
      </button>

      <ul className="list">
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onEdit={() => {
              setEditTodo(t);
              setOpen(true);
            }}
            refresh={fetchTodos}
          />
        ))}
      </ul>

      <TodoModal
        isOpen={open}
        initialValue={editTodo?.title}
        onClose={() => {
          setOpen(false);
          setEditTodo(null);
        }}
        onSave={editTodo ? updateTodo : addTodo}
      />
    </>
  );
}
