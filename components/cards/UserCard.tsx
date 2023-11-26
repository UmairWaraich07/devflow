import Image from "next/image";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Link from "next/link";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className=" shadow-light100_darknone max-xs:w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border  flex flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt={user.username}
          width={100}
          height={100}
          priority
          className="rounded-full object-cover"
        />

        <div className=" mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1 cursor-pointer">
            {user?.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2 cursor-pointer">
            @{user?.username}
          </p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center justify-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <RenderTag _id="1" name="No tags yet" noOpen />
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
