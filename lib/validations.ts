import * as z from "zod";

export const questionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const answerSchema = z.object({
  answer: z.string().min(100),
});

export const profileSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  portfolioWebsite: z.string().min(5),
  location: z.string().min(2),
  bio: z.string().min(10),
});
