import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className="w-full">
      <Skeleton className="w-40 h-14" />
      <div className="mt-11 mb-12">
        <Skeleton className="h-14 w-full" />
      </div>

      <div className="my-10 w-full flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Skeleton key={item} className="h-48 rounded-xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
