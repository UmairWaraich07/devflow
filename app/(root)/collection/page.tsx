import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const Collection = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const result = await getSavedQuestions({
    clerkId: userId,
  });

  return (
    <div className="w-full">
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex w-full flex-col justify-between gap-5 md:flex-row">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder="Search"
          iconPosition="left"
          route="/collection"
          otherClasses="flex-1"
        />
        <Filters
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-10 flex w-full flex-col gap-6">
        {result.savedQuestions.length > 0 ? (
          result.savedQuestions.map((question: any) => (
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
            title="No Saved Questions Found"
            description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
            link="/"
            linkText="Explore Questions"
          />
        )}
      </section>
    </div>
  );
};

export default Collection;
