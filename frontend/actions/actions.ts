'use server'
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers';

export async function get_all_todos() {
    try {
        const token = (await cookies()).get("access_token")?.value;

        const response = await fetch('http://127.0.0.1:8000/todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const res = await response.json();

        if (response.ok) {

            const todo_list = res

            return {
                status: "success",
                data: todo_list
            };

        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }

    } catch (error) {
        return {
            status: "error",
            message: "Server error"
        };
    }
}

export async function add_todo(state: { status: string; message: string }, formData: FormData) {
    const content = formData.get("add_task") as string

    try {
        const token = (await cookies()).get("access_token")?.value;
        const response = await fetch('http://127.0.0.1:8000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo added successfully" };
        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}

export async function edit_todo(state: { status: string; message: string }, { id, content, is_completed }: { id: number, content: string, is_completed: boolean }) {

    try {
        const token = (await cookies()).get("access_token")?.value;

        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, is_completed })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo edited successfully" };
        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}

export async function status_changed(id: number, content: string, is_completed: boolean) {

    try {
        const token = (await cookies()).get("access_token")?.value;

        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: content, is_completed: !is_completed })
        })
        const res = await response.json();
        if (res.content) {
            revalidatePath("/todos/");
            return { status: "success", message: "status changed successfully" };
        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }
    } catch (error) {
        return { status: "error", message: "Something went wrong" };
    }
}

export async function delete_todo(id: number) {

    try {
        const token = (await cookies()).get("access_token")?.value;

        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (response.ok) {
            revalidatePath("/todos/");
            return { status: "success", message: "Todo deleted successfully" };
        } else if (response.status === 401) {

            return {
                status: "error",
                message: "Unauthorized"
            };

        }
    } catch (error) {
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

    try {
        const response = await fetch('http://127.0.0.1:8000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const res = await response.json();

        if (response.ok) {

            // ✅ STORE TOKENS IN COOKIES
            (await
                // ✅ STORE TOKENS IN COOKIES
                cookies()).set("access_token", res.access_token, {
                    httpOnly: true,
                    secure: false, // production me true
                    path: "/",
                });

            (await cookies()).set("refresh_token", res.refresh_token, {
                httpOnly: true,
                secure: false,
                path: "/",
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


        const res = await response.json();

        if (response.ok) {

            // ✅ STORE TOKENS IN COOKIES
            (await
                // ✅ STORE TOKENS IN COOKIES
                cookies()).set("access_token", res.access_token, {
                    httpOnly: true,
                    secure: false, // production me true
                    path: "/",
                });

            (await cookies()).set("refresh_token", res.refresh_token, {
                httpOnly: true,
                secure: false,
                path: "/",
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