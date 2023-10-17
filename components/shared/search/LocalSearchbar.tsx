"use client";
import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";

interface LocalSearchbarProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchbarProps) => {
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] w-full grow cursor-pointer items-center
      gap-1 rounded-xl px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image src={imgSrc} width={24} height={24} alt="search" />
      )}
      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none text-dark-400 shadow-none outline-none dark:text-light-800"
      />

      {iconPosition === "right" && (
        <Image src={imgSrc} width={24} height={24} alt="search" />
      )}
    </div>
  );
};

export default LocalSearchbar;
