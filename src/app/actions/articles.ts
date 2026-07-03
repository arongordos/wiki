"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isArticleAuthor } from "@/db/authz";
import { db } from "@/db";
import { articles } from "@/db/schema";
import summarizeArticle from "@/ai/summarize";
import { del } from "@vercel/blob";

export type CreateArticleInput = {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  published?: boolean;
};

export type UpdateArticleInput = Partial<CreateArticleInput>;

async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("❌ Unauthorized");
  }

  return session?.user;
}

export async function createArticle(data: CreateArticleInput) {
  const user = await requireUser();

  const summary = await summarizeArticle(data.title, data.content);

  const [article] = await db
    .insert(articles)
    .values({
      ...data,
      authorId: user.id,
      summary,
    })
    .returning({ id: articles.id });

  return {
    success: true,
    message: "Article created successfully",
    id: article.id,
  };
}

export async function updateArticle(id: number, data: UpdateArticleInput) {
  const user = await requireUser();

  if (!(await isArticleAuthor(user.id, id))) {
    throw new Error("❌ Forbidden");
  }

  const summary = await summarizeArticle(data.title || "", data.content || "");

  await db
    .update(articles)
    .set({ ...data, summary })
    .where(and(eq(articles.id, id)));

  return { success: true, message: "Article updated successfully" };
}

export async function deleteArticle(id: number, url: string) {
  const user = await requireUser();

  if (!(await isArticleAuthor(user.id, id))) {
    throw new Error("❌ Forbidden");
  }

  await db.delete(articles).where(eq(articles.id, id));

  if (url) await del(url);

  return { success: true, message: "Article deleted successfully" };
}
