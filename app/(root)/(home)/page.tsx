import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";

export default async function Home() {
  const result = await getQuestions({});
  console.log(result.questions);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <Filters
          filters={HomePageFilters}
          containerClasses="hidden max-md:flex"
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <HomeFilters />

      <section className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question?.title || ""}
              tags={question.tags}
              author={question.author}
              createdAt={question.createdAt}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-a-question"
            linkText="Ask a Question"
          />
        )}
      </section>
    </>
  );
}
