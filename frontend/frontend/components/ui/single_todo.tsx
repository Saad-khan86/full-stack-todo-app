// import { Pencil, Trash2 } from "lucide-react"
// import { ToolTip } from "./Tool_tip";
// import { Modal } from "./modal";

// export default function Todo() {

//   const tasks = [
//     { id: 1, text: 'Task 1', completed: false },
//     { id: 2, text: 'Task 2', completed: false },
//     { id: 3, text: 'Task 3', completed: false },
//   ]

//   return (
//     <>
//       {tasks.map((task) => (
//         <tr key={task.id} className="border-b hover:bg-gray-50">
//           <td className="p-4">
//             <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
//               {task.text}
//             </span>
//           </td>
//           <td className="p-4 flex justify-end items-center">
//             <ToolTip tooltip_content="Mark as compeleted">
//               <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 rounded-sm focus:ring-teal-500 border-gray-300 mr-4" />
//             </ToolTip>
//             {/* Edit */}

//             <ToolTip tooltip_content="Edit Task">
//               <Modal title="Edit Taks" edit_task={true}>
//                 <button className="p-2 rounded hover:bg-zinc-100">
//                   <Pencil className="w-4 h-4 text-blue-600" />
//                 </button>
//               </Modal>
//             </ToolTip>

//             {/* Delete */}
//             <ToolTip tooltip_content="Delete Task">
//               <button className="p-2 rounded hover:bg-red-100">
//                 <Trash2 className="w-4 h-4 text-red-600" />
//               </button>
//             </ToolTip>
//           </td>
//         </tr >
//       ))
//       }
//     </>
//   );
// }