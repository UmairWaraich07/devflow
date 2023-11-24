"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../moongose";
import { AnswerVoteParams, QuestionVoteParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

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

    // increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
    if (JSON.stringify(userId) !== JSON.stringify(question.author)) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -1 : 1 },
      });
    }

    // increment author's reputation by +10/-10 for receiving an upvote/downvote to the question
    if (JSON.stringify(userId) !== JSON.stringify(question.author)) {
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    // const questionTags = await Question.findOne({_id : questionId});

    // await Interaction.create({
    //   user : userId,
    //   action: "upvote",
    //   question : questionId,
    //   tags :
    // })

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

    // increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
    if (JSON.stringify(userId) !== JSON.stringify(question.author)) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? 1 : -1 },
      });
    }

    // increment author's reputation by +10/-10 for receiving an upvote/downvote to the question
    if (JSON.stringify(userId) !== JSON.stringify(question.author)) {
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasdownVoted ? 10 : -10 },
      });
    }

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

    // increment author's reputation by +2/-2 for upvoting/revoking an upvote to the answer
    if (JSON.stringify(userId) !== JSON.stringify(answer.author)) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      });
    }

    // increment author's reputation by +10/-10 for receiving an upvote/downvote to the answer
    if (JSON.stringify(userId) !== JSON.stringify(answer.author)) {
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

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

    // increment author's reputation by +2/-2 for upvoting/revoking an upvote to the answer
    if (JSON.stringify(userId) !== JSON.stringify(answer.author)) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? 2 : -2 },
      });
    }

    // increment author's reputation by +10/-10 for receiving an upvote/downvote to the answer
    if (JSON.stringify(userId) !== JSON.stringify(answer.author)) {
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? 10 : -10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
