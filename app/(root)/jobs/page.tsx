import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "StudentFlow Jobs - Launch Your Programming Career",
  description:
    "Discover exciting programming job opportunities on StudentFlow.",
  keywords: [
    "programming",
    "jobs",
    "careers",
    "opportunities",
    "hiring",
    "studentflow",
  ],
};

const Jobs = () => {
  return (
    <section className="grid place-content-center pt-12">
      <Image
        src="/assets/images/work-in-progress.png"
        alt="coming soon"
        width={200}
        height={200}
      />
    </section>
  );
};

export default Jobs;
