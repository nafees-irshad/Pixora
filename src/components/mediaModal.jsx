import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollection } from "../redux/features/collectionSlice";
import AddToCollectionModal from "./addToCollectionModal";

const MediaModal = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.collection?.items || []);
  const isSaved = item ? savedItems.some((i) => i.id === item.id) : false;

  const [downloading, setDownloading] = useState(false);
  const [likeCount, setLikeCount] = useState(() => Math.floor(Math.random() * 80) + 12);
  const [copied, setCopied] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!item) return null;

  const mediaUrl = typeof item.src === "string" ? item.src : item.src?.link;
  const isVideo = item.type === "video";

  // Trigger real file download via Blob
  const handleDownload = async () => {
    if (!mediaUrl) return;
    try {
      setDownloading(true);
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const ext = isVideo ? "mp4" : item.type === "gif" ? "gif" : "jpg";
      link.download = `pixora-${item.title ? item.title.slice(0, 20).replace(/\s+/g, "-") : "media"}-${item.id || Date.now()}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: direct window open if CORS blocks blob fetch
      window.open(mediaUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleToggleLike = () => {
    dispatch(toggleCollection(item));
    setLikeCount((prev) => (isSaved ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (mediaUrl) {
      navigator.clipboard.writeText(mediaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col transition-all duration-300"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80">
          {/* Creator Profile */}
          <div className="flex items-center gap-3">
            {item.authorAvatar ? (
              <img
                src={item.authorAvatar}
                alt={item.author || "Creator"}
                className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
                {(item.author || "P").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white leading-tight">
                {item.author || "Pixora Creator"}
              </h4>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                {item.type || "Media"} Provider
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Like / Collection Button */}
            <button
              onClick={handleToggleLike}
              title={isSaved ? "Remove like" : "Like"}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isSaved
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 scale-105"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <svg
                className={`w-4 h-4 ${isSaved ? "fill-current" : "fill-none"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likeCount}</span>
            </button>

            {/* Add to Collection Button */}
            <button
              type="button"
              onClick={() => setIsCollectionModalOpen(true)}
              title="Add to Collection"
              className="px-3 sm:px-3.5 py-2 rounded-full border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs hover:scale-102 active:scale-95"
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
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
              <span className="hidden sm:inline">Add to collection</span>
            </button>

            {/* Share / Copy Link Button */}
            <button
              onClick={handleShare}
              title="Copy Media Link"
              className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/20 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <span>Free download</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer ml-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Media Player / Image Area */}
        <div className="relative bg-zinc-950 flex items-center justify-center p-2 sm:p-6 min-h-[300px] max-h-[65vh] overflow-hidden">
          {isVideo ? (
            <video
              src={mediaUrl}
              poster={item.thumbnail}
              controls
              autoPlay
              playsInline
              className="max-h-[60vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
            />
          ) : (
            <img
              src={item.src || item.thumbnail}
              alt={item.title || "Pixora Media"}
              className="max-h-[60vh] w-auto max-w-full rounded-xl shadow-2xl object-contain select-none"
            />
          )}
        </div>

        {/* Media Details Below */}
        <div className="p-6 bg-white dark:bg-zinc-900 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white capitalize">
                {item.title || "Untitled Media"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Published by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.author || "Creator"}</span>
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {item.type || "Media"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                Free License
              </span>
            </div>
          </div>

          {/* Full Link Action */}
          {mediaUrl && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>High Resolution Asset</span>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open original in new tab</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Add to Collection Modal Popup */}
      <AddToCollectionModal
        item={item}
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  );
};

export default MediaModal;
