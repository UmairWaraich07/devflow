import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden ">
      <div
        className="background-light800_darkgradient relative flex min-h-[56px] grow cursor-pointer items-center
    gap-1 rounded-xl px-4"
      >
        <Image
          src="assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search globally..."
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none text-dark-400 shadow-none outline-none dark:text-light-800"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;