"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../moongose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDB();

    const { userId, questionId } = params;

    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } } // Increment the view count by 1
    );

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User has already viewed");

      // create new interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(`Error while updating view : ${error}`);
    throw error;
  }
};
