"use client";
import { deleteUserAnswer } from "@/lib/actions/answer.action";
import { deleteUserQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = async () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      // delete Question
      await deleteUserQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
      });
      toast({
        title: "Question Deleted",
        description: "Your question has been deleted successfully",
        variant: "destructive",
      });
    } else {
      // delete answer
      await deleteUserAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });

      toast({
        title: "Answer Deleted",
        description: "Your answer has been deleted successfully",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit icon"
          width={14}
          height={14}
          className="cursor-pointer"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete icon"
        width={16}
        height={16}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
