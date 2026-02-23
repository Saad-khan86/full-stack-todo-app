import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { New_task } from "./new_taks"

export function Modal() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild ><Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center" variant="outline">ADD TASK +</Button></DialogTrigger> 
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Add new task</DialogTitle>
          </DialogHeader>
          < New_task />
        </DialogContent>
      </form>
    </Dialog>
  )
}
