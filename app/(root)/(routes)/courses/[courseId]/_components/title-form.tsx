"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//interface 
interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
};

//form schema
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const TitleForm = ({
  initialData,
  courseId
}: TitleFormProps) => {
  // state for editing
  const [isEditing, setIsEditing] = useState(false);
  // toggle
  const toggleEdit = () => setIsEditing((current) => !current);
  // router
  const router = useRouter();
  // form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  // destructure
  const { isSubmitting, isValid } = form.formState;
  // submit patch incase updated
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
  <div className="mt-6 border-2 shadow-md shadow-slate-100 bg-[#2c2c2c] bg-opacity-95 rounded p-4">
  <div className="font-extrabold flex items-center justify-between text-xl">
    course title
    <Button onClick={toggleEdit} >
      {isEditing ? (
        <>cancel</>
      ) : (
        <>
          <Pencil className="text-slate-200" />
          
        </>
      )}
    </Button>
  </div>
  {!isEditing && (
    <p className="text-lg mt-2">
      {initialData.title}
    </p>
  )}
  {isEditing && (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. 'Advanced web development'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            save
          </Button>
        </div>
      </form>
    </Form>
  )}
</div>
)
}