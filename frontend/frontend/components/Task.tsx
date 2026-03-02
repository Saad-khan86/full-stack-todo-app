'use client'
import { Pencil, Trash2 } from "lucide-react";
import ToolTip from "./ToolTip";
import { delete_todo, status_changed } from "@/actions/actions";
import toast from "react-hot-toast";
import Modal from "./Modal";



const Task = ({ task }: { task: Todo }) => {

  const handleStatus = async () => {
    const response = await status_changed(task.id, task.content, task.is_completed)
    if (response.status == "success") {
      toast.success(response.message);
    } else if (response.status == "error") {
      toast.error(response.message);
    }
  }

  const handleDelet = async () => {
    const response = await delete_todo(task.id)
    if (response.status == "success") {
      toast.success(response.message);
    } else if (response.status == "error") {
      toast.error(response.message);
    }
  }

  return (
    <>
      <tr key={task.id} className="border-b hover:bg-gray-50">
        <td className="p-4">
          <span className={`${task.is_completed ? 'line-through text-red-400' : 'text-gray-800'}`}>
            {task.content}
          </span>
        </td>
        <td className="p-4 flex justify-end items-center">

          {/* status changed */}
          <ToolTip tooltip_content="Mark as compeleted">
            <input onClick={handleStatus} type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded-sm focus:ring-teal-500 border-gray-300 mr-4" />
          </ToolTip>

          {/* Edit */}
          <ToolTip tooltip_content="Edit Task">
            <Modal title="Edit Task" edit_task={true} task={task}>
              <button className="p-2 rounded hover:bg-zinc-100">
                <Pencil className="w-4 h-4 text-blue-600" />
              </button>
            </Modal>
          </ToolTip>

          {/* Delete */}
          <ToolTip tooltip_content="Delete Task">
            <button onClick = {handleDelet} className="p-2 rounded hover:bg-red-100">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </ToolTip>
        </td>
      </tr >
    </>
  );
}

export default Task