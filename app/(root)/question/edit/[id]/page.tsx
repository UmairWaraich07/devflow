import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: params.id });

  console.log(params.id);

  console.log(mongoUser);

  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser?._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </section>
  );
};

export default page;
