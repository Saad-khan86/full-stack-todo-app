import { Modal } from "./modal";
import { Button } from "./button";
import { ToolTip } from "./Tool_tip";
import { Pencil, Trash2 } from "lucide-react";

const TodoList = async () => {

  const response = await fetch('http://127.0.0.1:8000/todos')
  const todo_list: Todo[] = await response.json()

  return (
    <>
      <Modal title="Add new Taks" new_task={true}>
        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-sm shadow-md transition-colors flex items-center justify-center" variant="default">ADD TASK +</Button>
      </Modal>
      <div className="bg-white rounded-lg shadow-md mt-4">

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-4 font-semibold text-gray-600">TASKS</th>
              <th className="text-right p-4 font-semibold text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {todo_list.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <span className={`${task.is_compeleted ? 'line-through text-red-400' : 'text-gray-800'}`}>
                    {task.content}
                  </span>
                </td>
                <td className="p-4 flex justify-end items-center">
                  <ToolTip tooltip_content="Mark as compeleted">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded-sm focus:ring-teal-500 border-gray-300 mr-4" />
                  </ToolTip>
                  {/* Edit */}

                  <ToolTip tooltip_content="Edit Task">
                    <Modal title="Edit Taks" edit_task={true}>
                      <button className="p-2 rounded hover:bg-zinc-100">
                        <Pencil className="w-4 h-4 text-blue-6  00" />
                      </button>
                    </Modal>
                  </ToolTip>

                  {/* Delete */}
                  <ToolTip tooltip_content="Delete Task">
                    <button className="p-2 rounded hover:bg-red-100">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </ToolTip>
                </td>
              </tr >
            ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TodoList;
