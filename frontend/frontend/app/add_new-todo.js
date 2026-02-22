"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function addTodo(todo, refresh) {
  await fetch(`http://127.0.0.1:8000/todos`, {
    method: "POST",
    body: JSON.stringify({ todo }),
  });

  refresh();
}

export default function AddNewTodo() {
  const router = useRouter();
  let [name, setName] = useState("");
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button
        onClick={async () => {
          await addTodo(name, router.refresh);
          setName("");
        }}
      >
        Add
      </button>
    </div>
  );
}
