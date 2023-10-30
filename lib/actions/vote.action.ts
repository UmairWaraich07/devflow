"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../moongose";
import { AnswerVoteParams, QuestionVoteParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    await connectToDB();

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery);

    if (!question) {
      throw new Error("Question not found!");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    await connectToDB();

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery);

    if (!question) {
      throw new Error("Question not found!");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Answer

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    await connectToDB();

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery);

    if (!answer) {
      throw new Error("Question not found!");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    await connectToDB();

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery);

    if (!answer) {
      throw new Error("Question not found!");
    }

    // increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
