import { Modal } from "./modal";
import { Button } from "./button";
import { ToolTip } from "./Tool_tip";
import { Pencil, Trash2 } from "lucide-react";
import Task from "./Task";

const TodoList = async () => {

  const response = await fetch('http://127.0.0.1:8000/todos')
  const data = await response.json()  
  const todo_list : Todo[] = data.sort((a:Todo,b:Todo)=>a.id - b.id)

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
              < Task key={task.id} task={task} />
            ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TodoList;
