import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { user, signInWithApple, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        // If user is already logged in, redirect to connect
        if (user) {
            navigate('/connect');
        }
    }, [user, navigate]);

    const handleAppleLogin = async () => {
        const { error } = await signInWithApple();
        if (error) {
            console.error('Apple login error:', error);
            alert('Failed to sign in with Apple. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            console.error('Google login error:', error);
            alert('Failed to sign in with Google. Please try again.');
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setAuthError('');

        if (!email || !password) {
            setAuthError('Please enter both email and password');
            return;
        }

        if (isSignUp) {
            const { data, error } = await signUpWithEmail(email, password);
            if (error) {
                setAuthError(error.message);
            } else if (data?.session) {
                // User is signed in immediately (Confirmation disabled)
                navigate('/connect');
            } else {
                // Confirmation still enabled in Supabase
                alert('Account created! Please check your email to confirm.');
            }
        } else {
            const { error } = await signInWithEmail(email, password);
            if (error) {
                setAuthError(error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#fa9a00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 bg-white animate-fade-in">
            <div className="flex flex-col items-center gap-6 mb-12">
                <div className="bg-gradient-to-br from-orange-100 to-white p-8 rounded-[2rem] border border-white">
                    <img src="/logo.png" alt="Cardly Logo" className="w-20 h-20 object-contain" />
                </div>
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-[#fa9a00] font-handwriting mb-2">Cardly</h1>
                    <p className="text-[#8B7355] text-lg font-medium tracking-wide">Stay connected through drawings</p>
                </div>
            </div>

            <div className="w-full max-w-xs flex flex-col gap-4">
                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#fa9a00] transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#fa9a00] transition-colors"
                    />

                    {authError && (
                        <p className="text-red-500 text-sm text-center">{authError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-[#fa9a00] text-white hover:bg-[#e08a00] active:scale-95 transition-all duration-200"
                    >
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-500 hover:text-[#fa9a00] transition-colors"
                >
                    {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Sign in with Apple */}
                <button
                    onClick={handleAppleLogin}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 bg-black text-white hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.12-1.62 1.35.06 2.59.63 3.54 1.82-3.17 1.68-2.6 6.09.62 7.59-.65 1.76-1.6 3.38-3.36 4.44zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Sign in with Apple
                </button>

                {/* Sign in with Google */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-200 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
