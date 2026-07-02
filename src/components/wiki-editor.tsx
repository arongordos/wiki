"use client";

import { useRouter } from "next/navigation";
import { createArticle, updateArticle } from "@/app/actions/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import type { Article } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArticleSchema } from "@/validators";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface WikiEditorProps {
  title?: string;
  content?: string;
  published?: boolean;
  isEditing?: boolean;
  articleId?: number;
}

export default function WikiEditor({
  title = "",
  content = "",
  published = false,
  isEditing = false,
  articleId,
}: WikiEditorProps) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Article>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title,
      content,
      published,
    },
  });

  async function handleArticleSubmit(data: Article) {
    try {
      const payload = {
        title: data.title.trim(),
        slug: data.title.trim().toLowerCase().replace(/\s+/g, "-"),
        published: data.published,
        content: data.content.trim(),
      };

      if (isEditing && articleId) {
        await updateArticle(articleId, payload);
        router.push(`/wiki/${articleId}`);
      } else {
        const result = await createArticle(payload);
        if (result.id) {
          router.push(`/wiki/${result.id}`);
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Error submitting article:", err);
    }
  }

  const pageTitle = isEditing ? "Edit Article" : "Create New Article";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      </div>

      <form id="wiki-editor-form" onSubmit={handleSubmit(handleArticleSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title">
              Title <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="title"
              disabled={isSubmitting}
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && <FieldError errors={[errors.title]} />}
          </Field>

          <Field data-invalid={!!errors.content}>
            <FieldLabel htmlFor="content">
              Content <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="content"
              disabled={isSubmitting}
              className="resize-none h-40"
              aria-invalid={!!errors.content}
              {...register("content")}
            />
            {errors.content && <FieldError errors={[errors.content]} />}
          </Field>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <Checkbox
                  id="published"
                  disabled={isSubmitting}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />

            <FieldContent>
              <FieldLabel htmlFor="published">Publish</FieldLabel>
              <FieldDescription>
                Check this box to make the article publicly visible.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="mt-4">
        <Button
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push(isEditing ? `/wiki/${articleId}` : "/")}
          className="cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          form="wiki-editor-form"
          className="cursor-pointer"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
              ? "Update Article"
              : "Save Article"}
        </Button>
      </Field>
    </>
  );
}
