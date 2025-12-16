import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { ENABLE_AUTH, AUTH_PASSWORD } from '../config';

interface LoginGateProps {
    children: React.ReactNode;
}

export default function LoginGate({ children }: LoginGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!ENABLE_AUTH) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('arrival_auth_token');
        if (token === 'valid') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPassword.toLowerCase() === AUTH_PASSWORD.toLowerCase()) {
            localStorage.setItem('arrival_auth_token', 'valid');
            setIsAuthenticated(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6 border border-accent/20">
                        <Lock className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-3xl font-bold text-text mb-2 tracking-tight">Arrival</h1>
                    <p className="text-text/60">Restricted Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            placeholder="Enter password"
                            className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-5 py-4 text-text placeholder:text-text/40 focus:outline-none focus:border-accent transition-all text-lg`}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
                    >
                        <span>Enter</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {error && (
                        <p className="text-red-500 text-center text-sm animate-pulse">
                            Incorrect password
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
