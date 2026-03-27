'use client';

import { useActionState } from 'react';
import { user_register } from "@/actions/actions"
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
const initialState = { status: "", message: "" }

export default function RegisterPage() {

    const [state, formAction, isPending] = useActionState(user_register, initialState)
    const { status, message } = state

    const router = useRouter()

    useEffect(() => {
        if (status == 'success') {
            toast.success(message)
            router.push("/")

        }
        else if (status == 'error') {
            toast.error(message)
        }
    }, [state]

    )

    return (
        <div className="flex justify-center items-center min-h-screen ">

            <form action={formAction} className="flex flex-col gap-4 w-80 p-5 border-1 shadow">

                <h1 className="text-2xl font-bold">Register</h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="border p-2"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2"
                    required
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-500 text-white p-2"
                >
                    {isPending ? 'Registering...' : 'Register'}
                </button>

                {/* ✅ Response message */}
                {state.message && (
                    <p
                        className={`text-sm ${state.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {state.message}
                    </p>
                )}

            </form>
        </div>
    );
}