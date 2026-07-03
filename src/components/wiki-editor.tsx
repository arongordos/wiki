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
import { useRef, useState } from "react";
import Image from "next/image";
import { deleteFile, uploadFile } from "@/app/actions/upload";

interface WikiEditorProps {
  title?: string;
  content?: string;
  published?: boolean;
  isEditing?: boolean;
  articleId?: number;
  imageUrl?: string | null;
}

export default function WikiEditor({
  title = "",
  content = "",
  published = false,
  isEditing = false,
  imageUrl,
  articleId,
}: WikiEditorProps) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

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
      let imageUrl: string | undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadedFile = await uploadFile(formData);
        imageUrl = uploadedFile.url;
      }

      const payload = {
        title: data.title.trim(),
        slug: data.title.trim().toLowerCase().replace(/\s+/g, "-"),
        published: data.published,
        content: data.content.trim(),
        imageUrl,
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

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  }

  async function handleRemoveFile() {
    if (file) setFile(null);

    if (imageUrl) {
      await deleteFile(articleId!, imageUrl);
      router.refresh();
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

          <Field>
            <FieldLabel htmlFor="image">Image</FieldLabel>
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              disabled={isSubmitting || !!imageUrl}
              onChange={handleFileUpload}
            />
            {imageUrl && (
              <span className="text-sm text-muted-foreground">
                Please remove the image before uploading a new one.
              </span>
            )}
          </Field>

          {(file || imageUrl) && (
            <div>
              <Image
                src={file ? URL.createObjectURL(file) : imageUrl || ""}
                alt={file ? file.name : "Article Image"}
                width={300}
                height={300}
                className="rounded-lg"
              />
              <div className="text-sm font-semibold">
                {file ? file.name : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {file ? (file.size / 1024).toFixed(2) + " KB" : null}
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemoveFile}
                className="mt-2 cursor-pointer"
              >
                Remove
              </Button>
            </div>
          )}

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
