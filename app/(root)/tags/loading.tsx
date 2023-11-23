import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="w-full">
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 mb-12 flex max-sm:flex-col sm:flex-row w-full justify-between gap-5 items-center">
        <Skeleton className="h-14 w-[70%] max-sm:w-full" />
        <Skeleton className="h-14 w-[30%] max-sm:w-full" />
      </div>

      <div className="mt-12 flex w-full flex-wrap items-center justify-start gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Skeleton
            key={item}
            className="h-52 max-sm:w-full w-[240px] rounded-xl"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
