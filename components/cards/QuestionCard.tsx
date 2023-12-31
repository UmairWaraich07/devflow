import React from "react";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { abbreviateNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

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
    clerkId: string;
  };
  createdAt: Date;
  upvotes: string[];
  views: number;
  answers: Array<Object>;
  clerkId?: string | null;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  createdAt,
  upvotes,
  views,
  answers,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="light-border dark:dark-gradient rounded-[10px] border bg-light-900 px-11 py-9 shadow-sm max-sm:px-8 max-sm:py-6">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="">
          <p className="subtle-regular text-dark400_light700 line-clamp-1 sm:hidden">
            {getTimestamp(createdAt)}
          </p>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 cursor-pointer">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed In add edit delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag._id} key={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Metric
            imgSrc={author.picture}
            alt="author"
            title={getTimestamp(createdAt)}
            value={author.name}
            textStyles="body-medium text-dark400_light700"
            href={`profile/${author.clerkId}`}
            isAuthor
          />
        </div>
        <div className="flex items-center gap-3">
          <Metric
            imgSrc="/assets/icons/like.svg"
            alt="Upvotes"
            value={abbreviateNumber(upvotes.length)}
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
