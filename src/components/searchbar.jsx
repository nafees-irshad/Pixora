import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTabs, setQuery } from "../redux/features/searchSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
    const currentQuery = useSelector((store) => store.search?.query || "");
    const activeTab = useSelector((store) => store.search?.activeTab || "photos");
    const [text, setText] = useState(currentQuery);
    const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
    const mediaMenuRef = useRef(null);
    const mediaTypes = [
        { id: "photos", label: "Photos" },
        { id: "videos", label: "Videos" },
        { id: "gif", label: "GIFs" },
    ];
    const selectedMediaType =
        mediaTypes.find((mediaType) => mediaType.id === activeTab.toLowerCase()) ||
        mediaTypes[0];

    useEffect(() => {
        if (!isMediaMenuOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!mediaMenuRef.current?.contains(event.target)) {
                setIsMediaMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setIsMediaMenuOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMediaMenuOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedQuery = text.trim();
        setText(submittedQuery);
        dispatch(setQuery(submittedQuery));
    };

    const handleClear = () => {
        setText("");
        dispatch(setQuery(""));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center w-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-full px-2 py-2 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-purple-500/10"
        >
            <div ref={mediaMenuRef} className="relative shrink-0">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isMediaMenuOpen}
                    onClick={() => setIsMediaMenuOpen((isOpen) => !isOpen)}
                    className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-zinc-800 px-3 sm:px-4 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                    <span>{selectedMediaType.label}</span>
                    <svg className={`w-4 h-4 text-zinc-400 transition-transform ${isMediaMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>
                {isMediaMenuOpen && (
                    <div
                        role="listbox"
                        aria-label="Media type"
                        className="absolute left-0 top-full z-40 mt-2 min-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                    >
                        {mediaTypes.map((mediaType) => (
                            <button
                                key={mediaType.id}
                                type="button"
                                role="option"
                                aria-selected={selectedMediaType.id === mediaType.id}
                                onClick={() => {
                                    dispatch(setActiveTabs(mediaType.id));
                                    setIsMediaMenuOpen(false);
                                }}
                                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                                    selectedMediaType.id === mediaType.id
                                        ? "bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-white"
                                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {mediaType.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Search Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search free photos, videos & GIFs..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none"
            />

            {/* Clear Button (if text exists) */}
            {text && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="p-1 mr-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
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
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
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
