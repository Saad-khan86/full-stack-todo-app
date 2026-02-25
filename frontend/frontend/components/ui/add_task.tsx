

export const Add_new_task = () => {
  return (
  <div>
    <form className='flex flex-col gap-4' action="">
      <input 
      type="text" 
      placeholder='add task here' 
      minLength={3} 
      maxLength={25} 
      required
      className='px-1 border w-full rounded-sm'/>
      <button type='submit' className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">ADD</button>
    </form>
  </div>
  )
}

