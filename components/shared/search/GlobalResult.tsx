"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        // fetch everything from everywhere
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "tag":
        return `/tags/${id}`;
      case "user":
        return `/profile/${id}`;

      default:
        return `/`;
    }
  };
  return (
    <div
      className="background-light800_dark400 text-dark400_light800 absolute z-10 mt-3 
    w-full rounded-xl py-5 shadow-sm"
    >
      <GlobalFilters />

      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          <div className="flex-center my-4 flex-col px-5 ">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : result.length > 0 ? (
          <div>
            {result.map((item: any, index: number) => (
              <Link
                href={renderLink(item.type, item.id)}
                key={item.type + item.id + index}
                className="flex w-full items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
              >
                <Image
                  src="/assets/icons/tag.svg"
                  alt="tag"
                  width={18}
                  height={18}
                  className="invert-colors mt-1 object-contain"
                />
                <div className="flex flex-col">
                  <p className="body-medium text-dark200_light800 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                    {item.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-center flex-col px-5 gap-2">
            <p className="text-5xl">🫣</p>
            <p className="text-dark200_light800 body-regular">
              Oops, No result found!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
