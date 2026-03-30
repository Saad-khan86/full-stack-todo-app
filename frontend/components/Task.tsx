'use client'

import { Pencil, Trash2, Loader2 } from "lucide-react";
import ToolTip from "./ToolTip";
import { delete_todo, status_changed } from "@/actions/actions";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { useTransition } from "react";

const Task = ({ task }: { task: Todo }) => {
  
  // Saparete pending states
  const [statusPending, startStatusTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [editPending, startEditTransition] = useTransition();

  const handleStatus = () => {
    startStatusTransition(async () => {
      const response = await status_changed(task.id, task.content, task.is_completed);
      
      if (response.status === "success") {
        toast.success(response.message);
      } else if (response.status === "error") {
        toast.error(response.message);
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const response = await delete_todo(task.id);
      
      if (response.status === "success") {
        toast.success(response.message);
      } else if (response.status === "error") {
        toast.error(response.message);
      }
    });
  };

  return (
    <tr key={task.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <span className={`${task.is_completed ? 'line-through text-red-400' : 'text-gray-800'}`}>
          {task.content}
        </span>
      </td>

      <td className="p-4 flex justify-end items-center gap-3">
        
        {/* ================== Checkbox ================== */}
        <ToolTip tooltip_content="Mark as completed">
          <input 
            type="checkbox" 
            checked={task.is_completed}
            disabled={statusPending} 
            onChange={handleStatus}
            className="form-checkbox h-4 w-4 text-teal-600 rounded-sm 
                       focus:ring-teal-500 border-gray-300 
                       cursor-pointer disabled:cursor-not-allowed 
                       disabled:opacity-60"
          />
        </ToolTip>

        {/* ================== Edit Button ================== */}
        <ToolTip tooltip_content="Edit Task">
          <Modal title="Edit Task" edit_task={true} task={task}>
            <button 
              disabled={editPending}
              className="p-2 rounded hover:bg-zinc-100 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
            >
              {editPending ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <Pencil className="w-4 h-4 text-blue-600" />
              )}
            </button>
          </Modal>
        </ToolTip>

        {/* ================== Delete Button ================== */}
        <ToolTip tooltip_content="Delete Task">
          <button 
            onClick={handleDelete} 
            disabled={deletePending}
            className="p-2 rounded hover:bg-red-100 disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
          >
            {deletePending ? (
              <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-red-600" />
            )}
          </button>
        </ToolTip>
      </td>
    </tr>
  );
};

export default Task;

//old code
// 'use client'
// import { Pencil, Trash2 } from "lucide-react";
// import ToolTip from "./ToolTip";
// import { delete_todo, status_changed } from "@/actions/actions";
// import toast from "react-hot-toast";
// import Modal from "./Modal";



// const Task = ({ task }: { task: Todo }) => {

//   const handleStatus = async () => {
//     const response = await status_changed(task.id, task.content, task.is_completed)
//     if (response.status == "success") {
//       toast.success(response.message);
//     } else if (response.status == "error") {
//       toast.error(response.message);
//     }
//   }

//   const handleDelet = async () => {
//     const response = await delete_todo(task.id)
//     if (response.status == "success") {
//       toast.success(response.message);
//     } else if (response.status == "error") {
//       toast.error(response.message);
//     }
//   }

//   return (
//     <>
//       <tr key={task.id} className="border-b hover:bg-gray-50">
//         <td className="p-4">
//           <span className={`${task.is_completed ? 'line-through text-red-400' : 'text-gray-800'}`}>
//             {task.content}
//           </span>
//         </td>
//         <td className="p-4 flex justify-end items-center">

//           {/* status changed */}
//           <ToolTip tooltip_content="Mark as compeleted">
//             <input onClick={handleStatus} type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded-sm focus:ring-teal-500 border-gray-300 mr-4" />
//           </ToolTip>

//           {/* Edit */}
//           <ToolTip tooltip_content="Edit Task">
//             <Modal title="Edit Task" edit_task={true} task={task}>
//               <button className="p-2 rounded hover:bg-zinc-100">
//                 <Pencil className="w-4 h-4 text-blue-600" />
//               </button>
//             </Modal>
//           </ToolTip>

//           {/* Delete */}
//           <ToolTip tooltip_content="Delete Task">
//             <button onClick = {handleDelet} className="p-2 rounded hover:bg-red-100">
//               <Trash2 className="w-4 h-4 text-red-600" />
//             </button>
//           </ToolTip>
//         </td>
//       </tr >
//     </>
//   );
// }

// export default Task