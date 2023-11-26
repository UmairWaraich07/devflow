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
  FormMessage,
} from "@/components/ui/form";
import { answerSchema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "../ui/use-toast";

interface Props {
  questionId: string;
  authorId: string;
  question: string;
}

const Answer = ({ questionId, authorId, question }: Props) => {
  const pathname = usePathname();
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleCreateAnswer(values: z.infer<typeof answerSchema>) {
    if (!authorId)
      return toast({
        title: "Please log in",
        description: "You must be logged in to post an answer",
      });

    try {
      setIsSubmitting(true);
      await createAnswer({
        author: JSON.parse(authorId),
        content: values.answer,
        question: questionId,
        path: pathname,
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }

      toast({
        title: "Answer Posted",
        description: "Your answer has been posted successfully",
      });
    } catch (error) {
      console.log(`errro while handling create answer : ${error}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateAIAnswer = async () => {
    if (!authorId)
      return toast({
        title: "Please log in",
        description: "You must be logged in to generate an AI answer",
      });

    setIsAISubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question }),
        }
      );
      const aiAnswer = await response.json();
      // convert plain text to html format
      const formattedText = aiAnswer.reply.replace(/\n/g, "<br />");
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedText);
      }
      toast({
        title: "AI Answer Generated",
        description:
          "The AI has successfully generated an answer based on your query.",
      });
    } catch (error) {
      console.log(`Error while generating AI answer ${error}`);
      throw error;
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-7 flex w-full flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none "
          onClick={generateAIAnswer}
          disabled={isAISubmitting}
        >
          {isAISubmitting ? (
            <ReloadIcon className="w-4 h-4 object-contain text-primary-500 animate-spin" />
          ) : (
            <Image
              src="/assets/icons/stars.svg"
              alt="stars"
              width={12}
              height={12}
              className="object-contain"
            />
          )}
          <p className="cursor-pointer">
            {isAISubmitting ? "Generating..." : "Generate AI answer"}
          </p>
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormControl className="mt-3.5">
                  {/* Explanation Editor */}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "print",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],

                      toolbar:
                        "undo redo | " +
                        "codesample bold italic forecolor | alignleft aligncenter | " +
                        "alignright alignjustify | bullist numlist ",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      content_style:
                        "body { font-family:Inter,sans-serif; font-size:16px }",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              className="primary-gradient w-fit !text-light-900 gap-1.5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <ReloadIcon className="w-4 h-4 object-contain text-light-900 animate-spin" />
              )}
              <p className="cursor-pointer">
                {isSubmitting ? "Posting..." : "Post Answer"}
              </p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
