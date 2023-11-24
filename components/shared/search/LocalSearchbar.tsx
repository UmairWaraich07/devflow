"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface LocalSearchbarProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchbarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebouneFn = setTimeout(() => {
      if (search) {
        const newUrl = createUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebouneFn);
  }, [searchParams, router, pathname, search, query, route]);

  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] w-full grow cursor-pointer items-center
      gap-1 rounded-xl px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image src={imgSrc} width={24} height={24} alt="search" />
      )}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder bg-transparent border-none text-dark400_light700
         shadow-none outline-none "
      />

      {iconPosition === "right" && (
        <Image src={imgSrc} width={24} height={24} alt="search" />
      )}
    </div>
  );
};

export default LocalSearchbar;
