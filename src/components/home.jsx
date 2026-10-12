import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./logo";
import ResultGrid from "./resultGrid";
import SearchBar from "./searchbar";
import ThemeToggle from "./themeToggle";
import UserProfileButton from "./userProfileButton";

const HomePage = () => {
  const user = useSelector((store) => store.auth?.user);
  const { query, activeTab } = useSelector((store) => store.search);
  const hasSearchQuery = Boolean(query?.trim());
  const [searchText, setSearchText] = useState(query || "");
  const [isSearchInNavbar, setIsSearchInNavbar] = useState(false);
  const heroSearchRef = useRef(null);
  const favoriteCount = useSelector(
    (store) => store.collection?.items?.length || 0,
  );

  useEffect(() => {
    const searchElement = heroSearchRef.current;
    if (!searchElement || hasSearchQuery) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSearchInNavbar(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(searchElement);
    return () => observer.disconnect();
  }, [hasSearchQuery]);

  const showNavbarSearch = hasSearchQuery || isSearchInNavbar;

  // Format dynamic title (e.g. "Free Stock Images", "Free Stock Videos", "Cat Images")
  const getDisplayTitle = () => {
    const tabLabel =
      activeTab.toLowerCase() === "photos"
        ? "Images"
        : activeTab.toLowerCase() === "videos"
          ? "Videos"
          : "GIFs";
    if (query && query.trim()) {
      const capitalizedQuery = query
        .trim()
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
      return `${capitalizedQuery} ${tabLabel}`;
    }
    return `Free Stock ${tabLabel}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-900 dark:text-white flex flex-col items-center transition-colors duration-300 font-outfit relative overflow-x-clip">
      {/* Top Navigation Bar - No bottom border / line */}
      <header className="w-full max-w-7xl px-4 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 z-30 sticky top-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-sm">
        {/* Brand Logo */}
        <Logo />

        {showNavbarSearch && (
          <div className="order-3 basis-full min-w-0 md:order-none md:basis-auto md:flex-1 md:max-w-2xl">
            <SearchBar value={searchText} onChange={setSearchText} />
          </div>
        )}

        {/* Right Controls: Theme Toggle + Profile */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {user && (
            <Link
              to="/collections"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
                <path d="M4 8h16" />
              </svg>
              <span className="hidden sm:inline">Collections</span>
              <span className="min-w-5 h-5 px-1 rounded-full bg-white/20 dark:bg-zinc-900/15 flex items-center justify-center text-xs">
                {favoriteCount}
              </span>
            </Link>
          )}
          <ThemeToggle />
          <UserProfileButton />
        </div>
      </header>

      {/* Hero Section: Centered H1 Heading -> Search Bar -> Tabs */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-6 pb-8 flex flex-col items-center text-center gap-6 z-20 relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-gabarito font-normal tracking-tight text-zinc-900 dark:text-white">
          {getDisplayTitle()}
        </h1>

        {!hasSearchQuery && (
          <div
            ref={heroSearchRef}
            className={`w-full max-w-2xl ${isSearchInNavbar ? "invisible" : ""}`}
          >
            <SearchBar value={searchText} onChange={setSearchText} />
          </div>
        )}

      </section>

      {/* Media Results Grid */}
      <main className="w-full max-w-7xl px-4 sm:px-8 pb-16 flex flex-col items-center relative z-10">
        <ResultGrid />
      </main>

      <footer className="w-full mt-auto border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-6 text-center">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Pixora - All rights reserved.
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Media provided by Unsplash, Pexels, and other third-party sources. Pixora does not host or claim ownership of the content.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
