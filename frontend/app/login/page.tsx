'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { user_login } from '@/actions/actions'; // path adjust karo
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const initialState = { status: "", message: "" }

export default function LoginPage() {

    const [state, formAction, isPending] = useActionState(user_login, initialState)
    const { status, message } = state

    const router = useRouter()

    useEffect(() => {
        if (status === 'success') {
            toast.success(message);
            router.push("/")
        } else if (status === 'error') {
            toast.error(message);
        }
    }, [status, message]);

    return (
        <div className="flex justify-center items-center min-h-screen">

            <form action={formAction} className="flex flex-col gap-4 w-80">

                <h1 className="text-2xl font-bold">Login</h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
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
                    {isPending ? 'Logging in...' : 'Login'}
                </button>

                {/* Optional message */}
                {message && (
                    <p
                        className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {message}
                    </p>
                )}

            </form>
        </div>
    );
}