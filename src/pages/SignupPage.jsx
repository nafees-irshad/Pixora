import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {signInWithPopup} from "firebase/auth";
import {auth, googleProvider} from "../firebase/firebase";
import {setUser} from "../redux/features/authSlice";
import {loadUserCollections} from "../redux/features/collectionSlice";

const SignupPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleGoogleSignup = async () => { // Important: Clear previous error first
        setErrorMsg("");

        try { // 1. Call signInWithPopup as early as possible (preserves user gesture)
            const result = await signInWithPopup(auth, googleProvider);

            // Only set loading after popup is successfully opened
            setLoading(true);

            const user = result.user;
            const token = await user.getIdToken();

            const userData = {
                uid: user.uid,
                name: user.displayName || "User",
                email: user.email,
                picture: user.photoURL
            };

            dispatch(setUser({user: userData, token}));
            dispatch(loadUserCollections(user.uid)); // ← Important
            navigate("/");
        } catch (err) {
            console.error("Firebase Google Sign-In error", err);

            // Better error handling
            switch (err.code) {
                case "auth/popup-closed-by-user":
                    // User closed the popup → no need to show error
                    break;
                case "auth/popup-blocked":
                    setErrorMsg("Popup was blocked by the browser. Please allow popups for this site and try again.",);
                    break;
                case "auth/cancelled-popup-request":
                    // Multiple clicks → ignore
                    break;
                case "auth/network-request-failed":
                    setErrorMsg("Network error. Please check your internet connection.");
                    break;
                default:
                    setErrorMsg(err.message || "Sign in with Google failed. Please try again.",);
            }
        } finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-white dark:bg-zinc-950 font-outfit flex flex-col relative overflow-x-hidden"> {/* Background Glow Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
            <div className="absolute -top-32 -left-20 w-[420px] h-[420px] bg-purple-500/20 dark:bg-purple-600/25 rounded-full blur-3xl animate-pulse"
                style={
                    {animationDuration: "8s"}
                }/>
            <div className="absolute top-10 right-0 w-[320px] h-[320px] bg-pink-500/15 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse"
                style={
                    {animationDuration: "10s"}
                }/>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[250px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-pulse"
                style={
                    {animationDuration: "12s"}
                }/>
        </div>

        {/* Compact Navbar */}
        <header className="w-full px-6 py-4 flex items-center justify-between z-10 relative shrink-0">
            <Link to="/" className="flex items-center gap-2 group select-none">
                <img src="https://ik.imagekit.io/jk9e7l2uo/ChatGPT%20Image%20Sep%205,%202026,%2012_45_04%20AM.png" alt="Pixora" className="h-8 w-auto object-contain transition-transform group-hover:scale-105"/>
                <span className="font-gabarito text-xl font-bold text-zinc-900 dark:text-white hidden sm:inline">
                    pixora
                </span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Browse
            </Link>
        </header>

        {/* Center Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-10 z-10 relative">
            <div className="w-full max-w-[520px]">
                <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl shadow-zinc-950/10 dark:shadow-zinc-950/60 p-8 sm:p-11 text-center flex flex-col items-center"> {/* Google / Brand Icon Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center shadow-inner mb-6">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    </div>

                    {/* Main H1 Heading */}
                    <h1 className="text-3xl sm:text-4xl font-gabarito font-bold text-zinc-900 dark:text-white tracking-tight">
                        Sign up with Google
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2.5 mb-7 leading-relaxed max-w-sm">
                        Join Pixora instantly to explore, save collections, and download
                                      free stock media.
                    </p>

                    {/* Error Message if any */}
                    {
                    errorMsg && (<div className="w-full mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 text-left"> {errorMsg} </div>)
                }

                    {/* Google Sign-in Button */}
                    <button id="signup-google" type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3.5 py-3.5 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 text-base font-semibold text-zinc-800 dark:text-zinc-100 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"> {
                        loading ? (<>
                            <svg className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            <span>Connecting to Google…</span>
                        </>) : (<>
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </>)
                    } </button>

                    {/* Terms and Privacy Notice */}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-7 leading-relaxed">
                        By continuing, you agree to Pixora's{" "}
                        <a href="#"
                            onClick={
                                (e) => e.preventDefault()
                            }
                            className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                            Terms of Service
                        </a>
                        {" "}
                        and{" "}
                        <a href="#"
                            onClick={
                                (e) => e.preventDefault()
                            }
                            className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </main>
    </div>);
};

export default SignupPage;
