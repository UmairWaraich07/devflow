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
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

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
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    if (filter) {
      switch (filter) {
        case "new_users":
          sortOptions = { joined: -1 };
          break;
        case "old_users":
          // Implement recommended filter logic
          sortOptions = { joined: 1 };

          break;

        case "top_contributors":
          sortOptions = { reputation: -1 };
          break;
      }
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
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
    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const query: FilterQuery<typeof Question> = {};
    const skipAmount = (page - 1) * pageSize;
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: 1 };

        break;
      case "oldest":
        sortOptions = { createdAt: -1 };

        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };

        break;
      case "most_viewed":
        sortOptions = { views: -1 };

        break;
      case "most_answered":
        sortOptions = { asnwers: -1 };

        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1, // to check if there is any next page
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
    const isNext = savedQuestions.length > pageSize;

    return { savedQuestions, isNext };
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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    // @ts-ignore
    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNextAnswers };
  } catch (error) {
    console.log(`Error while fetching users answers : ${error}`);
    throw error;
  }
};
