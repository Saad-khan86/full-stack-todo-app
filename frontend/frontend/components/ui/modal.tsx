
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Add_new_task } from "./add_task"
import { Edit_task } from "./Edit_task"
import { ReactNode } from "react"

export function Modal({title, new_task, edit_task, children, task}:{title:string, new_task?: boolean, edit_task?: boolean, children: ReactNode, task?:Todo}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild >
          {children}
          </DialogTrigger> 
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {new_task && < Add_new_task />}
          {edit_task && task && <Edit_task task={task} />}
        </DialogContent>
      </form>
    </Dialog>
  )
}
