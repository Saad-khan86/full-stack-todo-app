'use server'
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function get_all_todos() {
    try {

        const response = await authFetch('http://127.0.0.1:8000/todos', {
            method: 'GET',
            cache: 'no-store',
        });

        const data = await response.json();

        if (response.ok) {

            const todo_list = data

            return {
                status: "success",
                data: todo_list
            };

        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }else {
            return { 
                status: "error", 
                message: "Failed to get todos" 
            };
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { status: "error", message: "Something went wrong" };
    }
}

export async function add_todo(
  prevState: { status: string; message: string } | undefined, 
  formData: FormData
) {
    const content = formData.get("add_task") as string;

    // Optional: You can use prevState if needed (e.g., for progressive enhancement)

    try {
        const response = await authFetch('http://127.0.0.1:8000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo added successfully" };
        } else if (response.status === 401) {
            return {
                status: "error",
                message: "Unauthorized"
            };
        } else {
            return { 
                status: "error", 
                message: "Failed to add todo" 
            };
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
       
        return { 
            status: "error", 
            message: "Something went wrong" 
        };
    }
}

export async function edit_todo(state: { status: string; message: string }, { id, content, is_completed }: { id: number, content: string, is_completed: boolean }) {

    try {
        const response = await authFetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, is_completed })
        })
        const data = await response.json();
        if (data.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo edited successfully" };
        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        } else {
            return { 
                status: "error", 
                message: "Failed to edit todo" 
            };
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { status: "error", message: "Something went wrong" };
    }
}

export async function status_changed(id: number, content: string, is_completed: boolean) {

    try {
        const response = await authFetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content, is_completed: !is_completed })
        })
        if (response.ok) {
            revalidatePath("/todos/");
            return { status: "success", message: "status changed successfully" };
        }       
        else if (response.status === 401)
        return {
            status: "error",
            message: "Unauthorized"
        }; else {
            return { 
                status: "error", 
                message: "Failed to status change" 
            };
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { status: "error", message: "Something went wrong" };
    }
}

export async function delete_todo(id: number) {

    try {

        const response = await authFetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo deleted successfully" };
        } else if (response.status === 401)
        return {
            status: "error",
            message: "Unauthorized"

        }; else {
            return { 
                status: "error", 
                message: "Failed to delete todo" 
            };
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { status: "error", message: "Something went wrong" };
    }
}

export async function user_register(
    state: { status: string; message: string },
    formData: FormData
) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let cookieStore = (await cookies())

    try {
        const response = await fetch('http://127.0.0.1:8000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {

            // ✅ STORE TOKENS IN COOKIES
            cookieStore.set("access_token", data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                maxAge: 60 // 1 minute (60 seconds)
            });

            cookieStore.set("refresh_token", data.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                maxAge: 60 * 5 // 1 minute (60 seconds)
            });

            return {
                status: "success",
                message: "User registered & logged in 🎉"
            };
        }

        return { status: "error", message: "user already exist" };

    } catch {
        return { status: "error", message: "Server error" };
    }
}

export async function user_login(
    state: { status: string; message: string },
    formData: FormData
) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let cookieStore = (await cookies())

    try {
        // ⚠️ OAuth2 ke liye FormData hi bhejna hai
        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });


        const data = await response.json();

        if (response.ok) {


            // ✅ STORE TOKENS IN COOKIES
            cookieStore.set("access_token", data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                maxAge: 60 // 1 minute (60 seconds)
            });

            cookieStore.set("refresh_token", data.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                maxAge: 60 * 5 // 1 minute (60 seconds)
            });

            return {
                status: "success",
                message: "Login successful 🎉"
            };
        }

        return { status: "error", message: "Invalid username or password" };

    } catch {
        return { status: "error", message: "Server error" };
    }
}

export async function authFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    if (!access_token) {
        redirect('/login');
    }
    let res: Response | null = null; // Initialize with null

    try {
        res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers as HeadersInit || {}),
                Authorization: `Bearer ${access_token}`,
            },
        });

    } catch (error) {

        throw error;
    }

    // 🛑 Redirect MUST be outside try-catch
    if (!res || res.status === 401 || res.status === 403) {
        redirect('/login');
    }

    return res;
}