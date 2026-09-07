import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createCollection,
  deleteCollection,
  setActiveCollection,
  clearCollection,
} from "../redux/features/collectionSlice";
import ResultCard from "../components/resultCard";
import MediaModal from "../components/mediaModal";
import ThemeToggle from "../components/themeToggle";
import UserProfileButton from "../components/userProfileButton";
import CollectionFolderCard from "../components/collectionFolderCard";

const CollectionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const collections = useSelector((state) => state.collection?.collections || []);
  const activeCollectionId = useSelector(
    (state) => state.collection?.activeCollectionId || collections[0]?.id
  );

  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 'openedFolderId': when null, displays the Folders Grid Overview. When set, displays items inside that folder.
  const [openedFolderId, setOpenedFolderId] = useState(null);
  // 'viewMode': "folders" (modern album/folder view) or "media" (flat media view with tabs)
  const [viewMode, setViewMode] = useState("folders");

  if (!user) return null;

  const openedCollection = collections.find((c) => c.id === openedFolderId);
  const activeCollection =
    collections.find((c) => c.id === activeCollectionId) || collections[0] || { items: [] };

  const totalSavedCount = collections.reduce((acc, c) => acc + (c.items?.length || 0), 0);

  const handleCreateCollection = (e) => {
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

    dispatch(createCollection({ name }));
    setNewCollectionName("");
    setErrorMsg("");
    setIsCreateModalOpen(false);
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "delete", // "delete" | "clear"
    collectionId: null,
    collectionName: "",
    itemCount: 0,
  });

  const openDeleteModal = (id, name, count = 0, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      type: "delete",
      collectionId: id,
      collectionName: name,
      itemCount: count,
    });
  };

  const openClearModal = (id, name, count = 0) => {
    setConfirmModal({
      isOpen: true,
      type: "clear",
      collectionId: id,
      collectionName: name,
      itemCount: count,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "delete" && confirmModal.collectionId) {
      dispatch(deleteCollection(confirmModal.collectionId));
      if (openedFolderId === confirmModal.collectionId) {
        setOpenedFolderId(null);
      }
    } else if (confirmModal.type === "clear" && confirmModal.collectionId) {
      dispatch(clearCollection(confirmModal.collectionId));
    }
    setConfirmModal({
      isOpen: false,
      type: "delete",
      collectionId: null,
      collectionName: "",
      itemCount: 0,
    });
  };

  const handleOpenFolder = (col) => {
    setOpenedFolderId(col.id);
    dispatch(setActiveCollection(col.id));
  };

  const quickSuggestions = ["Wallpapers", "Nature 4K", "Architecture", "Minimalist", "Aesthetic"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-900 dark:text-white flex flex-col items-center transition-colors duration-300 font-outfit relative overflow-x-hidden">
      {/* Background Subtle Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div
          className="absolute -top-32 -left-20 w-[420px] h-[420px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "9s" }}
        />
        <div
          className="absolute top-20 right-0 w-[320px] h-[320px] bg-pink-500/10 dark:bg-pink-600/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "11s" }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl px-4 sm:px-8 py-5 flex items-center justify-between z-30 relative">
        <Link to="/" className="flex items-center gap-2.5 group select-none shrink-0">
          <img
            src="https://ik.imagekit.io/jk9e7l2uo/ChatGPT%20Image%20Sep%205,%202026,%2012_45_04%20AM.png"
            alt="Pixora Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-gabarito text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white hidden min-[480px]:inline">
            pixora
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Browse</span>
          </Link>
          <ThemeToggle />
          <UserProfileButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl px-4 sm:px-8 py-6 flex flex-col gap-6 relative z-10">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-gabarito font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                <span>My Collections</span>
              </h1>
              <span className="text-xs sm:text-sm font-sans font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {totalSavedCount} {totalSavedCount === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Organized into collection folders • Save photos, videos, and GIFs
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/70 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={() => {
                  setViewMode("folders");
                  setOpenedFolderId(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "folders" && !openedFolderId
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span>Folders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("media");
                  if (!openedFolderId && collections[0]) {
                    setOpenedFolderId(collections[0].id);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "media" || openedFolderId
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Media Grid</span>
              </button>
            </div>

            {/* Create Collection / Folder Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setNewCollectionName("");
                setErrorMsg("");
                setIsCreateModalOpen(true);
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[2.5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* ─── CASE A: FOLDERS OVERVIEW GRID ──────────────────────────────── */}
        {viewMode === "folders" && !openedFolderId && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <span>{collections.length} {collections.length === 1 ? "folder" : "folders"} available</span>
              <span>Click a folder to open and view its media</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((col) => (
                <CollectionFolderCard
                  key={col.id}
                  collection={col}
                  onClick={handleOpenFolder}
                  onDelete={(id, name, e) =>
                    openDeleteModal(id, name, col.items?.length || 0, e)
                  }
                />
              ))}

              {/* "+ Create New Folder" Action Card */}
              <div
                onClick={() => {
                  setNewCollectionName("");
                  setErrorMsg("");
                  setIsCreateModalOpen(true);
                }}
                className="group flex flex-col items-center justify-center min-h-[260px] p-6 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 bg-zinc-50/40 dark:bg-zinc-900/20 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs mb-3 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <h4 className="text-base font-bold font-gabarito text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Create Folder
                </h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-[180px]">
                  Add a new collection to organize your favorite media
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── CASE B: INSIDE A FOLDER OR MEDIA VIEW ────────────────────────── */}
        {(openedFolderId || viewMode === "media") && (
          <div className="flex flex-col gap-6">
            {/* Breadcrumbs & Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenedFolderId(null);
                    setViewMode("folders");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all hover:-translate-x-0.5 cursor-pointer border border-zinc-200/80 dark:border-zinc-700/60"
                >
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
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>All Folders</span>
                </button>

                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

                {/* Breadcrumb Path */}
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-zinc-400">Collections</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
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
                    <span>{(openedCollection || activeCollection).name}</span>
                  </span>
                </div>
              </div>

              {/* Actions for current folder */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {((openedCollection || activeCollection).items || []).length} items
                </span>

                {/* Clear folder items */}
                {((openedCollection || activeCollection).items || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      openClearModal(
                        (openedCollection || activeCollection).id,
                        (openedCollection || activeCollection).name,
                        ((openedCollection || activeCollection).items || []).length
                      )
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}

                {/* Delete collection if not default */}
                {(openedCollection || activeCollection).id !== "default_favorites" && (
                  <button
                    type="button"
                    onClick={(e) =>
                      openDeleteModal(
                        (openedCollection || activeCollection).id,
                        (openedCollection || activeCollection).name,
                        ((openedCollection || activeCollection).items || []).length,
                        e
                      )
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    Delete Folder
                  </button>
                )}
              </div>
            </div>

            {/* Quick Folder Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0 mr-1">
                Folders:
              </span>
              {collections.map((col) => {
                const targetCurrentId = (openedCollection || activeCollection).id;
                const isSelected = col.id === targetCurrentId;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setOpenedFolderId(col.id);
                      dispatch(setActiveCollection(col.id));
                    }}
                    className={`group px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap select-none ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    <span>{col.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-zinc-700 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {col.items?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Media Items Inside Folder */}
            {(openedCollection || activeCollection).items &&
            (openedCollection || activeCollection).items.length > 0 ? (
              <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-2">
                {(openedCollection || activeCollection).items.map((item, idx) => (
                  <ResultCard
                    key={item.id ? `${item.id}-${idx}` : idx}
                    item={item}
                    onClick={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="w-full my-8 py-16 px-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
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
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    No items in "{(openedCollection || activeCollection).name}" yet
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                    Click the heart icon on any photo, video, or GIF while browsing to add it to this folder.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenedFolderId(null);
                      setViewMode("folders");
                    }}
                    className="px-5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    ← Back to Folders
                  </button>
                  <Link
                    to="/"
                    className="px-5 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    Explore Free Media
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Collection / Folder Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-gabarito font-bold text-zinc-900 dark:text-white">
                  Create New Folder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
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

            <form onSubmit={handleCreateCollection} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="collection-name-input"
                  className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide"
                >
                  Folder Name
                </label>
                <input
                  id="collection-name-input"
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => {
                    setNewCollectionName(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="e.g. Wallpapers, Nature 4K, Cyberpunk"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                />
                {errorMsg && <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>}
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  Quick Ideas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setNewCollectionName(suggestion);
                        if (errorMsg) setErrorMsg("");
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      +{suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Media Modal Viewer */}
      {selectedItem && (
        <MediaModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Beautiful Centered Delete / Clear Confirmation Popup Modal */}
      {confirmModal.isOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-outfit"
          onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-150 relative text-zinc-900 dark:text-white"
          >
            {/* Warning / Trash Badge with Subtle Pulse */}
            <div className="relative w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
              <span className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping opacity-25 pointer-events-none" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {confirmModal.type === "delete" ? (
                  <>
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </>
                ) : (
                  <>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </>
                )}
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl font-gabarito font-bold text-zinc-900 dark:text-white leading-tight">
                {confirmModal.type === "delete" ? "Delete this folder?" : "Clear all items?"}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                {confirmModal.type === "delete" ? (
                  <>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      "{confirmModal.collectionName}"
                    </span>
                    ? This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to remove all {confirmModal.itemCount} saved{" "}
                    {confirmModal.itemCount === 1 ? "item" : "items"} from{" "}
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      "{confirmModal.collectionName}"
                    </span>
                    ?
                  </>
                )}
              </p>
            </div>

            {/* Folder Context Pill */}
            <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white truncate">
                  {confirmModal.collectionName}
                </span>
              </div>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0 ml-2">
                {confirmModal.itemCount} {confirmModal.itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-500/25 transition-all cursor-pointer"
              >
                {confirmModal.type === "delete" ? "Yes, Delete" : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
