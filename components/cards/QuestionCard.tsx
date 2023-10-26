import React from "react";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { abbreviateNumber, getTimestamp } from "@/lib/utils";

interface Props {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
  upvotes: number;
  views: number;
  answers: any[];
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  createdAt,
  upvotes,
  views,
  answers,
}: Props) => {
  return (
    <div className="light-border dark:dark-gradient rounded-[10px] border bg-light-900 px-11 py-9 shadow-sm max-sm:px-8 max-sm:py-6">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <p className="subtle-regular text-dark400_light700 line-clamp-1 sm:hidden">
            {getTimestamp(createdAt)}
          </p>
          <Link href="/">
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed In add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag._id} key={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Metric
            imgSrc="/assets/icons/avatar.svg"
            alt="author"
            title={getTimestamp(createdAt)}
            value={author.name}
            textStyles="body-medium text-dark400_light700"
            href={`profile/${_id}`}
            isAuthor
          />
        </div>
        <div className="flex items-center gap-3">
          <Metric
            imgSrc="/assets/icons/like.svg"
            alt="Upvotes"
            value={abbreviateNumber(upvotes)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgSrc="/assets/icons/message.svg"
            alt="Answers"
            value={abbreviateNumber(answers.length)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgSrc="/assets/icons/eye.svg"
            alt="Views"
            value={abbreviateNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
