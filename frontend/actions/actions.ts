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
        if (data.content) {
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
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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

        const data = await response.json();

        if (response.ok) {

            // ✅ STORE TOKENS IN COOKIES
            (await
                // ✅ STORE TOKENS IN COOKIES
                cookies()).set("access_token", data.access_token, {
                    httpOnly: true,
                    secure: false, // production me true
                    path: "/",
                });

            (await cookies()).set("refresh_token", data.refresh_token, {
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


        const data = await response.json();

        if (response.ok) {

            // ✅ STORE TOKENS IN COOKIES
            (await
                // ✅ STORE TOKENS IN COOKIES
                cookies()).set("access_token", data.access_token, {
                    httpOnly: true,
                    secure: false, // production me true
                    path: "/",
                });

            (await cookies()).set("refresh_token", data.refresh_token, {
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

export async function refresh_access_token() {

    const refresh_token = (await cookies()).get("refresh_token")?.value;
    console.log("checking refresh token in own func ", refresh_token)
    if (!refresh_token) {
        throw new Error("No refresh token found please login");
    }
    try {
        const response = await fetch("http://localhost:8000/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh_token: refresh_token
            })
        });
        console.log("check respose in refresh accses token", response)

        if (response.status == 401) {
            return null;
        }

        const data = await response.json();

        (await cookies()).set("access_token", data.access_token, {
            httpOnly: true,
            secure: false,
            path: "/",
        });

        return data.access_token;

    }
    catch {
        throw new Error("Server error");
    }
};

export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {

    let response: Response;

    try {
        const token = (await cookies()).get("access_token")?.value;

        if (!token) {
            throw new Error("No access token found");
        }

        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers as HeadersInit || {}),
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response status check in acceses_token: ", response.status)
        console.log("response check in acceses_token: ", response)

        // 🔁 Token expired
        if (response.status === 401) {
            console.log("before running refresh token func")
            const new_token = await refresh_access_token();
            console.log("after running refresh token func")
            console.log("check refresh token:", new_token)
            if (!new_token || new_token == null) {
                // ❗ refresh bhi fail → logout
                const cookieStore = (await cookies());

                cookieStore.delete("access_token");
                cookieStore.delete("refresh_token");

                throw new Error("Session expired. Please login again.");
            }

            response = await fetch(url, {
                ...options,
                headers: {
                    ...(options.headers as HeadersInit || {}),
                    Authorization: `Bearer ${new_token}`,
                },
            });
            console.log("response status check in refresh_token: ", response.status)
            console.log("response check in refresh_token: ", response)
        }

        return response;

    } catch {
        throw new Error("Something went wrong in authFetch");
    }
}