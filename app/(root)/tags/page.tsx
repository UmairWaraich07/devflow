import Filters from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { Link } from "lucide-react";
import TagCard from "@/components/cards/TagCard";
import React from "react";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <div className="w-full">
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex w-full flex-col justify-between gap-5 md:flex-row">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds here..."
          iconPosition="left"
          route="/tags"
          otherClasses="flex-1"
        />
        <Filters
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex w-full flex-wrap items-center justify-start gap-3">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Tags yet!</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Be the first to Ask a Question and use Tags
            </Link>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Pagination
          currentPage={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default Tags;
