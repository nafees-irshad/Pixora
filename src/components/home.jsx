import { useState } from "react";
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
  const [featuredItems, setFeaturedItems] = useState([]);
  const favoriteCount = useSelector(
    (store) => store.collection?.items?.length || 0,
  );

  // Format dynamic title for search results.
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

        <div className="order-3 basis-full min-w-0 md:order-none md:basis-auto md:flex-1 md:max-w-2xl">
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>

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

      {!hasSearchQuery ? (
        <section className="w-full max-w-7xl px-4 sm:px-8 py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6">
            <h2 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-gabarito font-normal leading-[1.04] tracking-tight text-zinc-950 dark:text-white">
              The best free stock photos, royalty free images &amp; videos shared by creators.
            </h2>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {[0, 1].map((index) => {
              const item = featuredItems[index];
              const image = item?.thumbnail || item?.src;

              return (
                <div
                  key={item?.id || `featured-placeholder-${index}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.title || "Free stock photo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                  )}
                  {item && (
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 sm:p-5">
                      <p className="line-clamp-2 text-sm sm:text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-white/80">
                        {item.author}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="w-full max-w-7xl px-4 sm:px-8 pt-8 pb-2">
          <h1 className="text-3xl sm:text-4xl font-gabarito font-normal tracking-tight text-zinc-900 dark:text-white">
            {getDisplayTitle()}
          </h1>
        </section>
      )}

      {/* Media Results Grid */}
      <main className="w-full max-w-7xl px-4 sm:px-8 pb-16 flex flex-col items-center relative z-10">
        <ResultGrid onFeaturedItems={setFeaturedItems} />
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
