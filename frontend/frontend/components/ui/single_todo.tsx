import { DeleteIcon, EditIcon } from "lucide-react";


export default function Todo() {

    const tasks=[
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: true },
    ]
      
  return (
    <div>
         {tasks.map((task) => (
              <tr key={task.id} className=" border-b hover:bg-gray-50 flex justify-between">
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
    </div>
  );
}