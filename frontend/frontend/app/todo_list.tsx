
'use client';

import { Modal } from '@/components/ui/modal';
import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const EditIcon = () => (
  <svg className="w-5 h-5 text-blue-500 hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
)

const DeleteIcon = () => (
  <svg className="w-5 h-5 text-red-500 hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)


const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: true },
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newTaskObj = {
      id: tasks.length + 1,
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    setIsAddingTask(false);
  };

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <div className="container mx-auto mt-2 p-4 max-w-2xl">
      < Modal />
      {isAddingTask && (
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-3 border-2 border-gray-200 rounded-l-lg focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="Enter new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-r-lg transition-colors"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-4 font-semibold text-gray-600">TASKS</th>
              <th className="text-right p-4 font-semibold text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.text}
                  </span>
                </td>
                <td className="p-4 flex justify-end items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-teal-600 rounded-sm focus:ring-teal-500 border-gray-300 mr-4" checked={task.completed} onChange={() => handleToggleTask(task.id)} />
                  <button className="mr-2">
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
