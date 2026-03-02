'use client'

import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"
import { edit_todo } from "@/actions/actions"
import { useRef } from "react"

const initialState = { status: "", message: "" }

  const EditTask = ({ task, closeModal}: { task: Todo, closeModal: () => void }) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const [state, form_action, pending] = useActionState(edit_todo, initialState)
  const { status, message } = state

  const hadleSubmit = (formdata: FormData) => {
    const id: number = task.id
    const content: string = formdata.get('edit task') as string
    const is_completed: boolean = task.is_completed
    form_action({ id, content, is_completed })
  }
  useEffect(() => {
    if (status == 'success') {
      inputRef.current!.value = ""
      toast.success(message)
      closeModal()
    }
    else if (status == 'error') {
      toast.error(message)
    }
  }, [state]

  )

  return (
    <div>
      <form className='flex flex-col gap-4' action={hadleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder='edit task here'
          minLength={3}
          maxLength={25}
          required
          name="edit task"
          defaultValue={task.content}
          className='px-1 border w-full rounded-sm' />
        <button disabled={pending} type='submit' className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">{pending ? "SAVING..." : "SAVE"}</button>
      </form>
    </div>
  )
}

export default EditTask


