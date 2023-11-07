"use server";

import User from "@/database/user.model";
import { connectToDB } from "../moongose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDB();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Find interaction for the users by group and tags

    return [
      { _id: "1", name: "Tag 1" },
      { _id: "2", name: "Tag 2" },
    ];
  } catch (error) {
    console.log(`Error while fetching top tags for users : ${error}`);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDB();
    const tags = await Tag.find({});
    return tags;
  } catch (error) {
    console.log(`Error while fetching all tags : ${error}`);
    throw error;
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    await connectToDB();
    const { tagId, searchQuery } = params;

    // const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne({ tagId }).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
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

    if (!tag) {
      throw new Error("Tag not found!");
    }
    const questions = tag.questions;

    return { tagName: tag.name, questions };
  } catch (error) {
    console.log(`Error while getting questions by tag id : ${error}`);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    connectToDB();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(`Error while fetching popular Tags : ${error}`);
    throw error;
  }
};
