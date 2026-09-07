import React from "react";
import { useDispatch } from "react-redux";
import { setQuery } from "../redux/features/searchSlice";

const Logo = () => {
  const dispatch = useDispatch();

  const handleLogoClick = () => {
    dispatch(setQuery(""));
  };

  return (
    <div
      onClick={handleLogoClick}
      className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
    >
      <img
        src="https://ik.imagekit.io/jk9e7l2uo/ChatGPT%20Image%20Sep%205,%202026,%2012_45_04%20AM.png"
        alt="Pixora Logo"
        className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
      />
      <span className="font-gabarito text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white hidden min-[480px]:inline">
        pixora
      </span>
    </div>
  );
};

export default Logo;
