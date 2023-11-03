"use client";
import { SignedOut, useAuth } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { sidebarLinks } from "@/constants/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";

const LeftsidebarContent = () => {
  const { userId: clerkId } = useAuth();
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-6 pb-12">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") {
          item.route = `/profile/${clerkId}`;
        }

        return (
          <Link
            key={item.label}
            href={item.route}
            className={`${
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900"
            } flex items-center justify-start gap-4 bg-transparent p-4`}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={`${isActive ? "" : "invert-colors"}`}
            />

            <p
              className={`${
                isActive ? "base-bold" : "base-medium"
              } max-lg:hidden`}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

const Leftsidebar = () => {
  return (
    <aside
      className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col items-center justify-between
     overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]"
    >
      <div>
        <LeftsidebarContent />
      </div>

      <div className="w-full">
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/account.svg"
                  alt="SignIn"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="small-medium btn-tertiary light-border-2 text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="sign-up"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
};

export default Leftsidebar;
