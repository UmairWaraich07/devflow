"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../moongose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";

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
    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(`error while fetching answers : ${error}`);
    throw error;
  }
};
