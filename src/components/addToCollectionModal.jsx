import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createCollection,
  toggleCollection,
} from "../redux/features/collectionSlice";

const AddToCollectionModal = ({ item, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const collections = useSelector((state) => state.collection?.collections || []);

  const [newCollectionName, setNewCollectionName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  // If user is not signed in, prompt to log in
  if (!user) {
    return (
      <div
        className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-150 font-outfit"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold font-gabarito text-zinc-900 dark:text-white">Sign In to Save</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create an account or sign in to organize media into your collection folders.
            </p>
          </div>
          <Link
            to="/login"
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all text-center cursor-pointer"
          >
            Sign In / Join Free
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const itemImgSrc =
    item.thumbnail || (typeof item.src === "string" ? item.src : item.src?.link) || "";

  const handleToggleItemInCol = (colId) => {
    dispatch(toggleCollection({ item, collectionId: colId }));
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name) {
      setErrorMsg("Please enter a collection name");
      return;
    }
    const exists = collections.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setErrorMsg("A collection with this name already exists");
      return;
    }

    dispatch(createCollection({ name, initialItem: item }));
    setNewCollectionName("");
    setErrorMsg("");
    setSuccessMsg(`Added to "${name}"!`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const quickSuggestions = ["Wallpapers", "Aesthetic", "Nature", "Architecture", "Minimalist"];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 relative text-zinc-900 dark:text-white font-outfit"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
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
            </div>
            <div>
              <h3 className="text-lg font-gabarito font-bold text-zinc-900 dark:text-white leading-tight">
                Add to Collection
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose a folder or create a new one
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Selected Media Item Preview Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60">
          <img
            src={itemImgSrc}
            alt={item.title || "Selected media"}
            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {item.title || "Selected Media"}
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 inline-block mt-0.5">
              {item.type || "Photo"}
            </span>
          </div>
        </div>

        {/* Success / Error notification */}
        {successMsg && (
          <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Existing Collections List */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Your Folders ({collections.length})
          </span>

          <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 pr-1 scrollbar-thin">
            {collections.map((col) => {
              const isInCol = (col.items || []).some((i) => i.id === item.id);
              return (
                <div
                  key={col.id}
                  onClick={() => handleToggleItemInCol(col.id)}
                  className={`group px-3 py-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                    isInCol
                      ? "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80"
                      : "bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200/70 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isInCol
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200">
                        {col.name}
                      </p>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {col.items?.length || 0} {col.items?.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  {/* Add / Added Button */}
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isInCol
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:text-rose-700 dark:group-hover:text-rose-300"
                        : "bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    {isInCol ? (
                      <>
                        <span className="group-hover:hidden flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Saved</span>
                        </span>
                        <span className="hidden group-hover:inline text-[11px]">
                          Remove
                        </span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Collection Inline Form */}
        <form onSubmit={handleCreateAndAdd} className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <label
            htmlFor="new-collection-input"
            className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
          >
            Create & Save to New Folder
          </label>
          <div className="flex items-center gap-2">
            <input
              id="new-collection-input"
              type="text"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="e.g. Wallpapers, Moodboard..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm hover:scale-102 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              + Create
            </button>
          </div>
          {errorMsg && <p className="text-[11px] text-red-500 mt-0.5">{errorMsg}</p>}

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {quickSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setNewCollectionName(tag);
                  if (errorMsg) setErrorMsg("");
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                +{tag}
              </button>
            ))}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:scale-102 active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
