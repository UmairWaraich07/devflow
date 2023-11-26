import Link from "next/link";

interface Props {
  tag: {
    _id: string;
    name: string;
    questions: string[];
  };
}

const TagCard = async ({ tag }: Props) => {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className=" shadow-light100_darknone w-full sm:w-[260px]"
    >
      <article className="background-light900_dark200 light-border  flex flex-col items-start rounded-2xl border px-8 py-10 ">
        <div
          className="paragraph-semibold light-border background-light800_dark400 text-dark300_light900 rounded-md
        border px-5 py-2 shadow-light-300 dark:shadow-none "
        >
          {tag.name}
        </div>

        <div className="small-medium text-dark400_light500 mt-3.5 flex items-center">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {tag.questions.length}+
          </span>
          Questions
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
