"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard'); // Auto-redirect to dashboard if already logged in
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err: any) {
            console.error("Authentication error:", err);
            // Provide user-friendly error messages
            let message = "An error occurred during authentication.";
            if (err.code === "auth/email-already-in-use") message = "This email is already registered.";
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") message = "Invalid email or password.";
            if (err.code === "auth/weak-password") message = "Password should be at least 6 characters.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
                <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="mb-8 flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-blue-500/20">
                        <Github className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-white">DevGrade</span>
                </Link>

                <div className="glass-card w-full rounded-2xl p-8 shadow-2xl border border-white/[0.08]">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isSignUp ? "Create an Account" : "Welcome Back"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isSignUp
                                ? "Join DevGrade to analyze and track your engineering portfolio."
                                : "Sign in to DevGrade to view your engineering portfolio."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-600"
                                placeholder="developer@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                isSignUp ? "Sign Up" : "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#30363d]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#161b22] text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={signInWithGoogle}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" /><path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" /><path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" /><path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" /></svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError("");
                            }}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-500">
                        By continuing, you agree to DevGrade's{' '}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
