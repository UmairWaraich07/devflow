import Image from "next/image";
import React from "react";
import Link from "next/link";

interface MetricProps {
  imgSrc: string;
  alt: string;
  value: number | string;
  title?: string;
  textStyles?: string;
  href?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgSrc,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgSrc}
        alt={alt}
        width={16}
        height={16}
        className=" rounded-full text-accent-blue"
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}{" "}
        <span className={`small-regular ${isAuthor ? "max-sm:hidden" : ""}`}>
          {isAuthor && "• asked"} {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
