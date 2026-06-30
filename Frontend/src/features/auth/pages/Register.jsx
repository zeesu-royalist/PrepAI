import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, User, Brain, ArrowLeft, Loader2 } from 'lucide-react'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")
        try {
            await handleRegister({ username, email, password })
            navigate("/dashboard")
        } catch (err) {
            setErrorMsg("Registration failed. Please check your details and try again.")
        }
    }

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center px-4 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-dots opacity-30 pointer-events-none" />

            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors group"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Home
            </Link>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 mb-3">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
                    <p className="text-zinc-400 text-sm mt-1">Get started with your custom interview roadmap</p>
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-2xl p-8 shadow-xl border border-zinc-800/80">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMsg && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300" htmlFor="username">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="yourname"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-3 text-sm text-zinc-150 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-3 text-sm text-zinc-150 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-3 text-sm text-zinc-150 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 py-3 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-zinc-500">Already have an account? </span>
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium hover:underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register