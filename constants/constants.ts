import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

export const topQuestions = [
  {
    _id: 1,
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  { _id: 2, title: "How can an airconditioning machine exist?" },
  { _id: 3, title: "Interrogated every time crossing UK Border as citizen" },
  { _id: 4, title: "Async/Await Function Not Handling Errors Properly" },
  { _id: 5, title: "How do I use express as a custom server in NextJS?" },
];

export const popularTags = [
  { _id: 1, name: "next js", totalQuestions: 19 },
  { _id: 2, name: "react js", totalQuestions: 9 },
  { _id: 3, name: "javascript", totalQuestions: 11 },
  { _id: 4, name: "python", totalQuestions: 35 },
  { _id: 5, name: "css", totalQuestions: 5 },
];

export const homeQuestions = [
  {
    _id: 1,
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    tags: [
      { _id: 1, name: "next.js" },
      { _id: 2, name: "react.js" },
    ],
    author: {
      _id: 1,
      name: "Umair",
      picture: "https://github.com/shadcn.png",
    },
    createdAt: new Date("2023"),
    upvotes: 14,
    views: 55,
    answers: [],
  },
  {
    _id: 2,
    title: "How to improve your sales using AI?",
    tags: [
      { _id: 1, name: "sales & marketing" },
      { _id: 2, name: "AI" },
    ],
    author: {
      _id: 1,
      name: "Zubair Amjad",
      picture: "https://github.com/shadcn.png",
    },
    createdAt: new Date("2023"),
    upvotes: 201,
    views: 699,
    answers: [],
  },
];
