import { Button } from "@/components/ui/button"
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

export function Modal({title, new_task, edit_task, children  }:{title:string, new_task?: boolean, edit_task?: boolean, children: ReactNode}) {
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
          {edit_task && < Edit_task />}
        </DialogContent>
      </form>
    </Dialog>
  )
}
