import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../redux/features/searchSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
    const currentQuery = useSelector((store) => store.search?.query || "");
    const [text, setText] = useState(currentQuery);

    useEffect(() => {
        setText(currentQuery);
    }, [currentQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setQuery(text.trim()));
    };

    const handleClear = () => {
        setText("");
        dispatch(setQuery(""));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center w-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-full px-5 py-3 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-purple-500/10"
        >
            {/* Search Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search free photos, videos & GIFs..."
                className="flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none pr-3"
            />

            {/* Clear Button (if text exists) */}
            {text && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="p-1 mr-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}

            {/* Search Submit Icon */}
            <button
                type="submit"
                aria-label="Search"
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </form>
    );
};

export default SearchBar;
