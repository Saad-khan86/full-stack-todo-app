'use server'
import { revalidatePath } from "next/cache"

export default async function add_todo(state: { status: string; message: string }, formData: FormData) {
    const content = formData.get("add_task") as string

    try {
        const response = await fetch('http://127.0.0.1:8000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content})
        })
        revalidatePath("/todos")
        return { status: 'success', message: 'Todo added successfully' }
        

    }
    catch (error) {
        return { status: 'error', message: 'somthing went wrong' }
    }

}