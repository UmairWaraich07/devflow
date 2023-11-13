"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../moongose";
import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDB();

    const { content, author, path, question } = params;

    // create a question
    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log(`error while writing answer to the answer : ${error}`);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    await connectToDB();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = {
          upvotes: -1,
        };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };

        break;
      case "recent":
        sortOptions = { createdAt: -1 };

        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(`error while fetching answers : ${error}`);
    throw error;
  }
};

export const deleteUserAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDB();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found!");

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
