'use server'
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers';

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
        const response = await authFetch('http://127.0.0.1:8000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        })

        const data = await response.json();
        if (response.ok) {
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

        }
    } catch (error) {
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
        const data = await response.json();
        if (data.content) {
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

        const response = await authFetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: 'DELETE'
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
                secure: false, // production me true
                path: "/",
            });

            cookieStore.set("refresh_token", data.refresh_token, {
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
                secure: false, // production me true
                path: "/",
            });

            cookieStore.set("refresh_token", data.refresh_token, {
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

// export async function refresh_access_token() {

//     let cookieStore = (await cookies())

//     const refresh_token = cookieStore.get("refresh_token")?.value;

//     console.log("checking refresh token in own func ", refresh_token)
//     if (!refresh_token) {
//         throw new Error("No refresh token found please login");
//     }
//     try {
//         const response = await fetch("http://localhost:8000/refresh", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 refresh_token: refresh_token
//             })
//         });
//         console.log("check status in refresh accses token", response.status)

//         if (response.status == 401) {
//             return null;
//         }

//         const data = await response.json();
//         console.log("check data in refresh func", data);

//         return data.access_token;

//     }
//     catch {
//         throw new Error("Server error");
//     }
// };

export async function authFetch(url: string, options: RequestInit = {}) {

    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    try {

        if (!access_token) {
            throw new Error("No access token found");
        }

        const res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers as HeadersInit || {}),
                Authorization: `Bearer ${access_token}`,
            },
        });
        console.log("response status check in acceses_token: ", res.status)

        return res;

    } catch (error) {
        console.error(error);
        throw error;
    }
}