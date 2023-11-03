import ProfileLink from "@/components/shared/ProfileLink";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { formatJoinDate } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Stats from "@/components/shared/Stats";
import QuestionsTab from "@/components/shared/QuestionsTab";
import AnswersTab from "@/components/shared/AnswersTab";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo.user.picture}
            alt="profile photo"
            width={120}
            height={120}
            className=" rounded-full border-[2px] border-[#FF7000] object-cover"
          />
          <div className="">
            <div className="mt-3">
              <h2 className="h2-bold text-dark100_light900">
                {userInfo.user.name}
              </h2>
              <h4 className="paragraph-regular text-dark200_light800">
                @{userInfo.user.username}
              </h4>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-4">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  icon="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Porfolio"
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  icon="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              <ProfileLink
                icon="/assets/icons/calendar.svg"
                title={formatJoinDate(userInfo.user.joined)}
              />
            </div>

            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3"></div>
        <SignedIn>
          {userInfo.user.clerkId === clerkId && (
            <Link href="/profile/edit">
              <Button
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px]
              rounded-lg px-4 py-3 shadow-sm "
              >
                Edit profile
              </Button>
            </Link>
          )}
        </SignedIn>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionsTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
