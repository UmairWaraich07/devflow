import EditProfile from "@/components/shared/EditProfile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async () => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <EditProfile
          userData={JSON.stringify(mongoUser)}
          clerkId={mongoUser.clerkId}
        />
      </div>
    </section>
  );
};

export default Page;
