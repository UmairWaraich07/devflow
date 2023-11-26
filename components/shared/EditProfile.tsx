"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  userData: string;
  clerkId: string;
}

const EditProfile = ({ userData, clerkId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const parsedUserData = JSON.parse(userData || "");
  // 1. Define your form.
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: parsedUserData.name || "",
      username: parsedUserData.username || "",
      location: parsedUserData.location || "",
      portfolioWebsite: parsedUserData.portfolioWebsite || "",
      bio: parsedUserData.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: values,
        path: pathname,
      });
      router.back();
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error) {
      console.log("Error while submitting user profile Data : ", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  className="no-focus paragraph-regular background-light800_dark400 light-border-2 
                  text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  {...field}
                  className="no-focus paragraph-regular background-light800_dark400 light-border-2 
                  text-dark300_light700 min-h-[56px] border"
                  required
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your portfolio link"
                  type="url"
                  {...field}
                  className="no-focus paragraph-regular background-light800_dark400 light-border-2 
                  text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where do you live?"
                  {...field}
                  className="no-focus paragraph-regular background-light800_dark400 light-border-2 
                  text-dark300_light700 min-h-[56px] border"
                  required
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="no-focus paragraph-regular background-light800_dark400 light-border-2 
                  text-dark300_light700 min-h-[120px] border"
                  placeholder="What's special about you?"
                  required
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            className="primary-gradient w-fit !text-light-900 gap-1.5"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <ReloadIcon className="w-4 h-4 object-contain text-light-900 animate-spin" />
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfile;
