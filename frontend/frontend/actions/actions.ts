'use server'
import { revalidatePath } from "next/cache"

export async function add_todo(state: { status: string; message: string }, formData: FormData) {
    const content = formData.get("add_task") as string

    try {
        const response = await fetch('http://127.0.0.1:8000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo added successfully" };
        } else {
            return { status: "error", message: "Not Found" };
        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}

export async function edit_todo(state: { status: string; message: string }, { id, content, is_completed }: { id: number, content: string, is_completed: boolean }) {

    try {
        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, is_completed })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo edited successfully" };
        } else {
            return { status: "error", message: "Not Found" };
        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}

export async function status_changed(id: number, content:string, is_completed:boolean) {

    try {
        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:content, is_completed:!is_completed })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "status changed successfully" };
        } else {
            return { status: "error", message: "Not Found" };
        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}