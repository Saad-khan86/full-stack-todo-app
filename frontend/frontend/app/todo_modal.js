"use client";

import { useState, useEffect } from "react";

export default function TodoModal({ isOpen, onClose, onSave, initialValue }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(initialValue || "");
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h3>{initialValue ? "Edit Task" : "Add Task"}</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onSave(title);
              onClose();
            }}
          >
            {initialValue ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
