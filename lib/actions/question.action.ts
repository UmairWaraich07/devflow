"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../moongose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import console from "console";
import { FilterQuery } from "mongoose";

export const getQuestions = async (params: GetQuestionParams) => {
  try {
    await connectToDB();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const query: FilterQuery<typeof Question> = {};
    const skipAmount = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    if (filter) {
      switch (filter) {
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "recommended":
          // Implement recommended filter logic

          break;
        case "frequent":
          // Implement frequent filter logic
          sortOptions = { views: -1 };
          break;
        case "unanswered":
          query.answers = { $size: 0 };
          break;
      }
    }

    const questions = await Question.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

    const totalQuestionsSize = await Question.countDocuments();

    const isNext = Math.ceil(totalQuestionsSize / pageSize) > page;
    // const isNext = totalQuestionsSize > skipAmount + questions.length;
    return { questions, isNext };
  } catch (error) {
    console.log(`Error while fetching questions  : ${error}`);
    throw error;
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    await connectToDB();

    const { title, content, tags, author, path } = params;

    // create a question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user's ask question

    // Increment the author's reputation +5

    revalidatePath(path);
  } catch (error) {}
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    await connectToDB();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question;
  } catch (error) {
    console.log(`Error while fetching question details  : ${error}`);
    throw error;
  }
};

export const deleteUserQuestion = async (params: DeleteQuestionParams) => {
  try {
    connectToDB();
    const { questionId, path } = params;
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    connectToDB();

    const { questionId, title, content, path } = params;
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new Error("Question not found");

    question.title = title;
    question.content = content;
    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(`Error while editing question : ${error}`);
    throw error;
  }
};

export const getHotQuestions = async () => {
  try {
    connectToDB();
    const topQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return topQuestions;
  } catch (error) {
    console.log(`Error while fetching hotQuestions : ${error}`);
    throw error;
  }
};
