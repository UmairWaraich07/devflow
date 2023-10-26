"use server";

import User from "@/database/user.model";
import { connectToDB } from "../moongose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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
