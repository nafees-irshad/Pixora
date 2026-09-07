import React from "react";

const CollectionFolderCard = ({ collection, onClick, onDelete }) => {
  const items = collection.items || [];
  const itemCount = items.length;
  const isDefault = collection.id === "default_favorites";

  // Helper to extract image source
  const getItemImgSrc = (item) => {
    if (!item) return "";
    return item.thumbnail || (typeof item.src === "string" ? item.src : item.src?.link) || "";
  };

  return (
    <div
      onClick={() => onClick && onClick(collection)}
      className="group relative flex flex-col bg-white dark:bg-zinc-900/90 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 hover:border-purple-500/40 dark:hover:border-purple-500/40 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Top Folder Tab Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Folder SVG Icon */}
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
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
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-gabarito font-bold text-zinc-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {collection.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Item count chip */}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/40 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>

          {/* Delete collection button */}
          {!isDefault && onDelete && (
            <button
              type="button"
              title={`Delete folder "${collection.name}"`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(collection.id, collection.name, e);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
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
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Folder Media Preview Collage */}
      <div className="relative w-full aspect-4/3 bg-zinc-100 dark:bg-zinc-950 overflow-hidden p-2.5">
        {itemCount === 0 ? (
          /* Empty State */
          <div className="w-full h-full rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-4 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-2">
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Empty Folder
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              Save photos or videos to view here
            </span>
          </div>
        ) : itemCount === 1 ? (
          /* 1 Item */
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <img
              src={getItemImgSrc(items[0])}
              alt={items[0].title || collection.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : itemCount === 2 ? (
          /* 2 Items: Split 2-column collage (Combines them into a folder!) */
          <div className="w-full h-full grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[0])}
                alt={items[0].title || "Item 1"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[1])}
                alt={items[1].title || "Item 2"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ) : itemCount === 3 ? (
          /* 3 Items: 1 left + 2 stacked right */
          <div className="w-full h-full grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[0])}
                alt={items[0].title || "Item 1"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full h-full grid grid-rows-2 gap-2">
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                <img
                  src={getItemImgSrc(items[1])}
                  alt={items[1].title || "Item 2"}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
                <img
                  src={getItemImgSrc(items[2])}
                  alt={items[2].title || "Item 3"}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        ) : (
          /* 4+ Items: 2x2 grid with +N badge */
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 rounded-2xl overflow-hidden">
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[0])}
                alt={items[0].title || "Item 1"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[1])}
                alt={items[1].title || "Item 2"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[2])}
                alt={items[2].title || "Item 3"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-200 dark:bg-zinc-800">
              <img
                src={getItemImgSrc(items[3])}
                alt={items[3].title || "Item 4"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {itemCount > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  +{itemCount - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-white/90 text-zinc-950 text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            <span>Open Folder</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>

      {/* Footer info bar */}
      <div className="px-5 py-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800/60">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Collection Folder</span>
        </span>
        <span className="font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          View contents →
        </span>
      </div>
    </div>
  );
};

export default CollectionFolderCard;
