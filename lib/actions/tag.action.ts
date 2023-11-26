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
import { FilterQuery } from "mongoose";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    await connectToDB();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Get all the questions published by the given user
    const questions = await Question.find({ author: userId }).populate("tags");

    // Create a map to store the tag counts
    const tagCounts: { [tagId: string]: number } = {};
    for (const question of questions) {
      for (const tag of question.tags) {
        if (!tagCounts[tag.id]) {
          tagCounts[tag.id] = 0;
        }
        tagCounts[tag.id]++;
      }
    }

    // Sort the tag counts in descending order
    const sortedTagCounts = Object.entries(tagCounts).sort(
      (a, b) => b[1] - a[1]
    );

    // Extract the top three tag IDs
    const topThreeTagIds = sortedTagCounts.slice(0, 3).map((tag) => tag[0]);

    // Fetch the top three tags
    const topThreeTags = await Promise.all(
      topThreeTagIds.map(async (tagId) => {
        const tagModel = await Tag.findById(tagId);
        return {
          _id: tagId,
          name: tagModel.name,
        };
      })
    );

    return topThreeTags;
  } catch (error) {
    console.log(`Error while fetching top tags for users : ${error}`);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectToDB();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const query: FilterQuery<typeof Tag> = {};
    const skipAmount = (page - 1) * pageSize;
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };

        break;
      case "recent":
        sortOptions = { createdOn: -1 };

        break;
      case "name":
        sortOptions = { name: 1 };

        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const totalTagsSize = await Tag.countDocuments(query);

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const isNext = totalTagsSize > skipAmount + tags.length;
    return { tags, isNext };
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
    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const tag = await Tag.findOne({ _id: tagId }).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // to check if there is a next page
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

    const isNext = questions.length > pageSize;

    return { tagName: tag.name, questions, isNext };
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
