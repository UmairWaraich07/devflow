import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
  });

  return (
    <div className="w-full">
      <h1 className="h1-bold text-dark100_light900">{result.tagName}</h1>

      <div className="mt-11 flex w-full flex-col justify-between gap-5 md:flex-row">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tag questions..."
          iconPosition="left"
          route={`/tags/${params.id}`}
          otherClasses="flex-1"
        />
      </div>

      <section className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
    </div>
  );
};

export default Page;
