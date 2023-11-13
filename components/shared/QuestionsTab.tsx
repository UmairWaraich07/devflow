import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.questions.length > 0 ? (
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
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
        <p>No Questions</p>
      )}

      <div className="mt-10">
        <Pagination
          currentPage={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
