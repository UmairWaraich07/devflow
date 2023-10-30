"use server";

import User from "@/database/user.model";
import { connectToDB } from "../moongose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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
