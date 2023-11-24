"use client";
import { Input } from "@/components/ui/input";
import { createUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const pathname = usePathname();
  const [search, setSearch] = useState(query || "");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);
  useEffect(() => {
    const handleOutsideclick = (event: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideclick);

    return () => {
      document.removeEventListener("click", handleOutsideclick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebouneFn = setTimeout(() => {
      if (search) {
        const newUrl = createUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        } else {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebouneFn);
  }, [search, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden "
      ref={searchContainerRef}
    >
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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) {
              setIsOpen(false);
            }
          }}
          placeholder="Search globally..."
          className="paragraph-regular no-focus placeholder bg-transparent border-none
           text-dark-400_light700 shadow-none outline-none dark:text-light-700"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
