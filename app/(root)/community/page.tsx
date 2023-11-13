import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Community = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <div className="w-full">
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex w-full flex-col justify-between gap-5 md:flex-row">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds here..."
          iconPosition="left"
          route="/community"
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex w-full flex-wrap items-center justify-start gap-3">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet!</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first
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

export default Community;
