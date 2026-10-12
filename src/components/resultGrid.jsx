import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchPhotos,
  fetchVideos,
  fetchGifs,
  fetchRandomPhotos,
  fetchPopularVideos,
} from "../api/media.api";
import ResultCard from "./resultCard";
import MediaModal from "./mediaModal";

const PAGE_SIZE = 20;
const MAX_PAGES = 10; // Safety limit for API usage; adjust as needed.

const extractUrl = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.url || "";
};

function MediaFeed({ query, activeTab, onFeaturedItems }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const sentinelRef = useRef(null);
  const videoStartPage = useRef(Math.floor(Math.random() * 5) + 1);
  const isHome = !query?.trim();
  const searchTerm = query?.trim() || "trending";
  const tab = (activeTab || "photos").toLowerCase();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let batch = [];
        if (tab === "photos") {
          const response = isHome
            ? await fetchRandomPhotos(PAGE_SIZE)
            : await fetchPhotos(searchTerm, page, PAGE_SIZE);
          const photos = isHome ? response : response.results || [];
          batch = photos.map((item) => ({
            id: item.id,
            type: "photo",
            title: item.alt_description || item.description || "Unsplash Photo",
            author: item.user?.name || item.user?.username || "Photographer",
            authorAvatar: item.user?.profile_image?.small,
            thumbnail: item.urls?.regular || item.urls?.small,
            src: item.urls?.full || item.urls?.regular,
          }));
        } else if (tab === "videos") {
          const response = isHome
            ? await fetchPopularVideos(
                videoStartPage.current + page - 1,
                PAGE_SIZE,
              )
            : await fetchVideos(searchTerm, page, PAGE_SIZE);
          batch = (response.videos || []).map((item) => {
            const videoFile =
              item.video_files?.find((f) => f.quality === "hd") ||
              item.video_files?.[0];
            return {
              id: item.id,
              title: item.user?.name ? `Video by ${item.user.name}` : "Video",
              author: item.user?.name || "Creator",
              type: "video",
              thumbnail: item.image,
              src: videoFile?.link || item.video_files?.[0]?.link,
            };
          });
        } else if (tab === "gif") {
          const response = await fetchGifs(searchTerm, page, PAGE_SIZE);
          const gifList =
            response?.data?.data ||
            response?.data ||
            (Array.isArray(response) ? response : []);
          batch = gifList.map((item) => {
            const gifUrl =
              extractUrl(item.file?.hd?.gif) ||
              extractUrl(item.file?.md?.gif) ||
              extractUrl(item.file?.sm?.gif) ||
              extractUrl(item.files?.gif) ||
              extractUrl(item.files?.hd) ||
              extractUrl(item.files?.mediumgif) ||
              extractUrl(item.images?.original) ||
              extractUrl(item.url);
            return {
              id: item.id || gifUrl,
              title: item.title || "GIF",
              author: item.user?.username || item.author || "Klipy",
              type: "gif",
              thumbnail:
                extractUrl(item.file?.sm?.gif) ||
                extractUrl(item.file?.md?.gif) ||
                extractUrl(item.file?.xs?.gif) ||
                extractUrl(item.files?.tinygif) ||
                extractUrl(item.files?.mediumgif) ||
                extractUrl(item.files?.preview) ||
                gifUrl,
              src: gifUrl,
            };
          });
        }

        if (cancelled) return;
        setItems((previous) => {
          const seen = new Set(
            previous.map((item) => `${item.type}:${item.id}`),
          );
          const unique = batch.filter((item) => {
            const key = `${item.type}:${item.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return [...previous, ...unique];
        });
        setHasMore(batch.length >= PAGE_SIZE && page < MAX_PAGES);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch media");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page, query, tab, isHome, searchTerm]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || !hasMore || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore, error]);

  useEffect(() => {
    if (isHome && onFeaturedItems) {
      onFeaturedItems(items.slice(0, 2));
    }
  }, [isHome, items, onFeaturedItems]);

  const visibleItems = isHome && onFeaturedItems ? items.slice(2) : items;

  return (
    <div className="w-full max-w-7xl px-4 flex flex-col items-center gap-8 mt-6">
      <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {visibleItems.map((item) => (
          <ResultCard
            key={`${item.type}:${item.id}`}
            item={item}
            onClick={(selected) => setSelectedItem(selected)}
          />
        ))}
      </div>

      {loading && (
        <div
          className="w-full text-center py-8 text-sm text-zinc-500"
          role="status"
        >
          Loading {page === 1 ? "media" : "more media"}...
        </div>
      )}
      {error && (
        <div className="text-center py-6 text-red-600">
          <p>{error}</p>
          <button
            type="button"
            className="mt-2 underline cursor-pointer"
            onClick={() => {
              // Remount the feed to retry from the first page.
              window.location.reload();
            }}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="py-12 text-zinc-500">No results found.</p>
      )}
      {!loading && !error && !hasMore && items.length > 0 && (
        <p className="py-6 text-sm text-zinc-500">You've reached the end.</p>
      )}
      <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
      {selectedItem && (
        <MediaModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default function ResultGrid({ onFeaturedItems }) {
  const { query, activeTab } = useSelector((store) => store.search);
  return (
    <MediaFeed
      key={JSON.stringify([
        query?.trim() || "",
        (activeTab || "photos").toLowerCase(),
      ])}
      query={query}
      activeTab={activeTab}
      onFeaturedItems={onFeaturedItems}
    />
  );
}
