'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import  AddTask  from "./AddTask"
import EditTask from "./EditTask"
import { ReactNode, useState } from "react"

const Modal = ({title, new_task, edit_task, children, task}:{title:string, new_task?: boolean, edit_task?: boolean, children: ReactNode, task?:Todo}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <form>
        <DialogTrigger asChild >
          {children}
          </DialogTrigger> 
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {new_task && < AddTask closeModal={() => setOpen(false)}  /> }
          {edit_task && task && <EditTask task={task} closeModal={() => setOpen(false)} />}
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default Modal