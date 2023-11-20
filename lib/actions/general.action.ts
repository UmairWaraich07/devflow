"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { SearchParams } from "./shared.types";
import { connectToDB } from "../moongose";

const searchableTypes = ["question", "answer", "tag", "user"];

export const globalSearch = async (params: SearchParams) => {
  try {
    connectToDB();
    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };
    let results: any = [];
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
      { model: User, searchField: "name", type: "user" },
    ];

    const lowerType = type?.toLowerCase();
    if (!lowerType || !searchableTypes.includes(lowerType)) {
      // Search across everywhere
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResult = await model
          .find({ [searchField]: regexQuery })
          .limit(2);
        results.push(
          ...queryResult.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      // SEARCH IN THE SPECIFIED MODEL TYPE
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) {
        throw new Error("Invalid search Type!");
      }
      const queryResult = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResult.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(`Error during global search : ${error}`);
    throw error;
  }
};
