import { Button } from "./ui/button";
import Task from "./Task";
import Modal from "./Modal";
import { get_all_todos } from "@/actions/actions";

const TodoList = async () => {

  const result = await get_all_todos();

  const todo_list: Todo[] = Array.isArray(result?.data) ? result.data.sort((a, b) => a.id - b.id) : []

  return (
    <>
      <Modal title="Add new Task" new_task={true}>
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
            {todo_list.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  🚫 There is no Task added yet. Click <strong>Add Task</strong> to get started.
                </td>
              </tr>
            ) : (
              todo_list.map((task) => (
                <Task key={task.id} task={task} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TodoList;
