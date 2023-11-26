import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  noOpen?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount, noOpen }: Props) => {
  const renderTag = (
    <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md px-4 py-2 uppercase shadow-sm dark:shadow-none line-clamp-1">
      {name}
    </Badge>
  );
  if (noOpen) {
    return renderTag;
  } else {
    return (
      <Link
        key={_id}
        href={`/tags/${_id}`}
        className="flex justify-between gap-2 shadow-light-200 dark:shadow-none"
      >
        {renderTag}
        {showCount && (
          <p className="small-medium text-dark500_light700">{totalQuestions}</p>
        )}
      </Link>
    );
  }
};

export default RenderTag;
