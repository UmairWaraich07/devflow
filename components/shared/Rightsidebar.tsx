import { popularTags, topQuestions } from "@/constants/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import RenderTag from "./RenderTag";

const Rightsidebar = () => {
  return (
    <aside
      className="background-light900_dark200 text-dark100_light900 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col
  gap-16 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className="flex items-start justify-between gap-6"
            >
              <p className="body-medium text-dark500_light700 flex-1">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron-right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Rightsidebar;
