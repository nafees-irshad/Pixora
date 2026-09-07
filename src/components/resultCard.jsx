import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollection } from "../redux/features/collectionSlice";
import AddToCollectionModal from "./addToCollectionModal";

const ResultCard = ({ item, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.collection?.items || []);
  const isSaved = savedItems.some((i) => i.id === item.id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (item.type === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleToggleHeart = (e) => {
    e.stopPropagation();
    dispatch(toggleCollection(item));
  };

  const isVideo = item.type === "video" && item.src;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer break-inside-avoid mb-4"
    >
      {/* Media Element */}
      <div className="relative w-full overflow-hidden">
        {isVideo ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={typeof item.src === "string" ? item.src : item.src?.link}
              poster={item.thumbnail}
              muted
              loop
              playsInline
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Video Indicator Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-opacity duration-200 group-hover:opacity-0">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>VIDEO</span>
            </div>
          </div>
        ) : (
          <img
            src={item.thumbnail || item.src}
            alt={item.title || "Pixora Media"}
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Media Type Badge (GIF / PHOTO) */}
        {!isVideo && item.type && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider transition-opacity duration-200 group-hover:opacity-0 shadow-xs">
            {item.type === "photo" || item.type === "unsplash" ? "PHOTO" : item.type}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 pointer-events-none">
        {/* Top Header inside overlay */}
        <div className="flex items-center justify-between pointer-events-auto">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {item.type || "Media"}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Heart / Save to Collection Button */}
            <button
              type="button"
              onClick={handleToggleHeart}
              title={isSaved ? "Remove from collection" : "Save to collection"}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
                isSaved
                  ? "bg-rose-500 text-white shadow-md scale-105"
                  : "bg-white/20 hover:bg-white text-white hover:text-rose-500"
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
            </button>

            {/* Add to Specific Collection Folder Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollectionModalOpen(true);
              }}
              title="Add to Collection"
              className="p-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white text-white hover:text-purple-600 transition-all duration-200 cursor-pointer"
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
            </button>

            {item.src && (
              <a
                href={typeof item.src === "string" ? item.src : item.src?.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md transition-colors duration-200"
                title="Open full resolution"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Details inside overlay */}
        <div className="flex flex-col gap-1.5 text-white pointer-events-auto">
          {item.title && (
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 drop-shadow-sm capitalize">
              {item.title}
            </h3>
          )}

          {item.author && (
            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-200">
              {item.authorAvatar ? (
                <img
                  src={item.authorAvatar}
                  alt={item.author}
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {item.author.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate font-medium">{item.author}</span>
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

export default ResultCard;
