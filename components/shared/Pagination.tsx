"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { createUrlQuery } from "@/lib/utils";

interface Props {
  currentPage: number;
  isNext: boolean;
}

const Pagination = ({ currentPage, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? currentPage + 1 : currentPage - 1;

    const newUrl = createUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };

  if (currentPage === 1 && !isNext) return null;

  return (
    <div className="flex-center w-full gap-3">
      <Button
        disabled={currentPage === 1}
        className="light-border-2 btn flex-center min-h-[36px] gap-2 rounded-lg border"
        onClick={() => handleNavigation("prev")}
      >
        <p className="body-medium text-dark200_light800 cursor-pointer">Prev</p>
      </Button>
      <div className="flex-center primary-gradient rounded-md px-3.5 py-2.5">
        <p className="body-semibold text-light-900">{currentPage}</p>
      </div>
      <Button
        disabled={!isNext}
        className="light-border-2 btn flex-center min-h-[36px] gap-2 rounded-lg border"
        onClick={() => handleNavigation("next")}
      >
        <p className="body-medium text-dark200_light800 cursor-pointer">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
