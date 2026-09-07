import React, { useEffect, useState } from "react";
import { fetchPhotos, fetchVideos, fetchGifs } from "../api/media.api";
import {
  setActiveTabs,
  setResults,
  setLoading,
  setError,
  setPage,
} from "../redux/features/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import ResultCard from "./resultCard";
import MediaModal from "./mediaModal";

const MAX_PAGE = 10;

const ResultGrid = () => {
  const { query, activeTab, page, results, loading, error } = useSelector(
    (store) => store.search,
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(setLoading());
        const searchTerm = query?.trim() || "trending";
        let data = [];

        const currentTab = (activeTab || "photos").toLowerCase();

        if (currentTab === "photos") {
          let response = await fetchPhotos(searchTerm, page, 20);
          data = (response.results || []).map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description || item.description || "Unsplash Photo",
            author: item.user?.name || item.user?.username || "Photographer",
            authorAvatar: item.user?.profile_image?.small,
            thumbnail: item.urls?.regular || item.urls?.small,
            src: item.urls?.full || item.urls?.regular,
          }));
        }

        if (currentTab === "videos") {
          let response = await fetchVideos(searchTerm, page, 20);
          data = (response.videos || []).map((item) => {
            const videoFile =
              item.video_files?.find((f) => f.quality === "hd") ||
              item.video_files?.[0];
            return {
              id: item.id,
              title: item.user?.name
                ? `Video by ${item.user.name}`
                : searchTerm || "Video",
              author: item.user?.name || "Creator",
              type: "video",
              thumbnail: item.image,
              src: videoFile?.link || item.video_files?.[0]?.link,
            };
          });
        }

        if (currentTab === "gif") {
          let response = await fetchGifs(searchTerm, page, 20);
          const gifList =
            response?.data?.data ||
            response?.data ||
            (Array.isArray(response) ? response : []);

          const extractUrl = (val) => {
            if (!val) return "";
            if (typeof val === "string") return val;
            if (typeof val === "object" && val.url) return val.url;
            return "";
          };

          data = gifList.map((item) => {
            const gifUrl =
              extractUrl(item.file?.hd?.gif) ||
              extractUrl(item.file?.md?.gif) ||
              extractUrl(item.file?.sm?.gif) ||
              extractUrl(item.files?.gif) ||
              extractUrl(item.files?.hd) ||
              extractUrl(item.files?.mediumgif) ||
              extractUrl(item.images?.original) ||
              extractUrl(item.url) ||
              "";

            const thumbUrl =
              extractUrl(item.file?.sm?.gif) ||
              extractUrl(item.file?.md?.gif) ||
              extractUrl(item.file?.xs?.gif) ||
              extractUrl(item.files?.tinygif) ||
              extractUrl(item.files?.mediumgif) ||
              extractUrl(item.files?.preview) ||
              gifUrl;

            return {
              id: item.id || Math.random().toString(),
              title: item.title || "GIF",
              author: item.user?.username || item.author || "Klipy",
              type: "gif",
              thumbnail: thumbUrl,
              src: gifUrl,
            };
          });
        }

        dispatch(setResults(data));
      } catch (err) {
        dispatch(setError(err.message || "Failed to fetch media"));
      }
    };

    getData();
  }, [query, activeTab, page, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= MAX_PAGE && newPage !== page) {
      dispatch(setPage(newPage));
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-md my-12 p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
          Failed to load content
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="mb-4 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/60 animate-pulse break-inside-avoid"
            style={{ height: `${200 + (i % 3) * 80}px` }}
          />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-md my-16 text-center py-12 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <p className="text-base font-medium text-zinc-600 dark:text-zinc-400">
          No results found for "{query || "trending"}"
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
          Try searching for something else
        </p>
      </div>
    );
  }

  const pageGroupStart = page < 3 ? 1 : Math.floor(page / 3) * 3 + 1;
  const visiblePages = Array.from(
    { length: Math.min(3, MAX_PAGE - pageGroupStart + 1) },
    (_, index) => pageGroupStart + index,
  );

  return (
    <div className="w-full max-w-7xl px-4 flex flex-col items-center gap-8 mt-6">
      {/* Masonry Grid */}
      <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {results.map((item, idx) => (
          <ResultCard
            key={item.id ? `${item.id}-${idx}` : idx}
            item={item}
            onClick={(selected) => setSelectedItem(selected)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 my-8 p-1.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-xs">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
            page === 1
              ? "opacity-30 cursor-not-allowed text-gray-400 dark:text-zinc-600"
              : "cursor-pointer text-gray-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1.5">
          {visiblePages.map((pageNum) => {
            const isActive = page === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm scale-105"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white hover:scale-105"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {pageGroupStart + visiblePages.length - 1 < MAX_PAGE && (
            <span className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-zinc-500">
              ...
            </span>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === MAX_PAGE}
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
            page === MAX_PAGE
              ? "opacity-30 cursor-not-allowed text-gray-400 dark:text-zinc-600"
              : "cursor-pointer text-gray-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
          }`}
        >
          <span>Next</span>
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Individual Item Modal with Download, Video Player, and Details */}
      {selectedItem && (
        <MediaModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default ResultGrid;
