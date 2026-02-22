"use client";

export default function TodoItem({ todo, onEdit, refresh }) {
  const deleteTodo = async () => {
    await fetch(`http://127.0.0.1:8000/todos/${todo.id}`, {
      method: "DELETE",
    });
    refresh();
  };

  return (
    <li className="item">
      <span>{todo.title}</span>

      <div>
        <button onClick={onEdit}>✏️</button>
        <button onClick={deleteTodo}>🗑️</button>
      </div>
    </li>
  );
}
