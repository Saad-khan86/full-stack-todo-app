'use client';

import { useState } from "react";
import Todo from "./single_todo";

const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: true },
  ]);

  return (      
      <div className="bg-white rounded-lg shadow-md mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-4 font-semibold text-gray-600">TASKS</th>
              <th className="text-right p-4 font-semibold text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
           < Todo />
          </tbody>
        </table>
      </div>
  );
};

export default TodoList;
