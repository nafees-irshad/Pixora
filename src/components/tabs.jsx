import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTabs } from "../redux/features/searchSlice";

const Tabs = () => {
  const tabs = [
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
    { id: "gif", label: "GIFs" }
  ];
  const activeTab = useSelector((state) => state.search?.activeTab || "photos");
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab.toLowerCase() === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch(setActiveTabs(tab.id))}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center whitespace-nowrap ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
