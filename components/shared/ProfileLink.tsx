import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  icon: string;
  title: string;
  href?: string;
}

const ProfileLink = ({ icon, title, href }: Props) => {
  return (
    <div className="flex items-start justify-center gap-1">
      <Image src={icon} alt="icon" width={20} height={20} className="" />
      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
