'use client'

import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"
import { edit_todo } from "@/actions/actions"
import { useRef } from "react"

const initialState = { status: "", message: "" }

export const Edit_task = ({ task }: { task: Todo }) => {

  const ref = useRef<HTMLFormElement>(null)
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
      ref.current!.value = ""

      toast.success(message)
    }
    else if (status == 'error') {
      toast.error(message)
    }
  }, [state]

  )

  return (
    <div>
      <form ref={ref} className='flex flex-col gap-4' action={hadleSubmit}>
        <input
          type="text"
          placeholder='edit task here'
          minLength={3}
          maxLength={25}
          required
          name="edit task"
          className='px-1 border w-full rounded-sm' />
        <button disabled={pending} type='submit' className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">{pending ? "SAVING..." : "SAVE"}</button>
      </form>
    </div>
  )
}


