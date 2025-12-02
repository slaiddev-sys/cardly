import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Detect if running in native app
    const isNativeApp = Capacitor.isNativePlatform();

    const getRedirectUrl = () => {
        if (isNativeApp) {
            console.log('Running native: using custom scheme');
            return 'com.love.cardly.app://connect';
        }
        console.log('Running web: using origin');
        return `${window.location.origin}/connect`;
    };

    // Sign in with Apple
    const signInWithApple = async () => {
        try {
            if (isNativeApp) {
                // 1. Native iOS Sign In
                const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');

                const result = await SignInWithApple.authorize({
                    clientId: 'com.love.cardly.app',
                    redirectURI: 'https://rbdovlothaubhxdanzwy.supabase.co/auth/v1/callback',
                    scopes: 'email name',
                });

                if (result.response && result.response.identityToken) {
                    // 2. Exchange native token with Supabase
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: 'apple',
                        token: result.response.identityToken,
                        nonce: result.response.nonce,
                    });

                    if (error) throw error;
                    return { data, error: null };
                } else {
                    throw new Error('No identity token returned');
                }
            } else {
                // Web Fallback
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'apple',
                    options: {
                        redirectTo: getRedirectUrl(),
                    },
                });
                return { data, error };
            }
        } catch (error) {
            console.error('Apple login error:', error);
            return { data: null, error };
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: getRedirectUrl(),
            },
        });
        return { data, error };
    };

    // Sign up with Email
    const signUpWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    };

    // Sign in with Email
    const signInWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            setSession(null);
        }
        return { error };
    };

    const value = {
        user,
        session,
        loading,
        signInWithApple,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
