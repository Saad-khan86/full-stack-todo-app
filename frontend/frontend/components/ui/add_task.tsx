'use client'

import add_todo from "@/actions/actions"
import { useActionState, useEffect} from "react"
import toast from "react-hot-toast"


const initialState = {status:"", message:""}
export const Add_new_task = () => {
  const [state, form_action, pending] = useActionState( add_todo, initialState)
  const {status, message} = state

  useEffect( () => {
    if (status == 'success'){
      toast.success(message)
    }
    else if (status == 'error'){
      toast.error(message)
    }
  }, [state]
    
  )
  
  return (
  <div>
    <form  action={form_action} className='flex flex-col gap-4'>
      <input 
      type="text" 
      placeholder='add task here' 
      minLength={3} 
      maxLength={25} 
      name="add_task" 
      required
      className='px-1 border w-full rounded-sm'/>
      <button disabled={pending} type='submit' className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">{pending ? "ADDING..." : "ADD"}</button>
    </form>
  </div>
  )
}

