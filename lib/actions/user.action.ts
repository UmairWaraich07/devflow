"use server";

import User from "@/database/user.model";
import { connectToDB } from "../moongose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";

export const getUserById = async (params: any) => {
  try {
    await connectToDB();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(`User error : ${error}`);
    throw error;
  }
};
export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(`Create User error : ${error}`);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDB();
    const { clerkId, updateData, path } = params;

    await User.updateOne({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(`Update user error : ${error}`);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDB();
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments etc

    // get user questionIds
    // const userQuestionIds = Question.find({ author: user._id }).distinct("_id");

    // delete user Question
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers etc
  } catch (error) {
    console.log(`Delete user error : ${error}`);
    throw error;
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectToDB();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log(`Error while fetching all users : ${error}`);
    throw error;
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    await connectToDB();
    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    const isQuestionSaved = user.saved.includes(userId);

    const updateQuery = isQuestionSaved
      ? { $pull: { saved: questionId } }
      : { $push: { saved: questionId } };

    const savedQuestion = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    if (!savedQuestion) {
      throw new Error("Saved Question not Found!");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(`Error while saving question : ${error}`);
    throw error;
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    await connectToDB();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }
    const savedQuestions = user.saved;
    return { savedQuestions };
  } catch (error) {
    console.log(`Error while fetching saved questions : ${error}`);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    await connectToDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log(`Error while fetching users answers : ${error}`);
    throw error;
  }
};
