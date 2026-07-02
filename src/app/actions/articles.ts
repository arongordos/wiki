"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isArticleAuthor } from "@/db/authz";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { mockDelay } from "@/lib/utils";

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
  await mockDelay(3000);

  const user = await requireUser();

  const [article] = await db
    .insert(articles)
    .values({
      ...data,
      authorId: user.id,
    })
    .returning({ id: articles.id });

  return {
    success: true,
    message: "Article created successfully",
    id: article.id,
  };
}

export async function updateArticle(id: number, data: UpdateArticleInput) {
  await mockDelay(3000);

  const user = await requireUser();

  if (!(await isArticleAuthor(user.id, id))) {
    throw new Error("❌ Forbidden");
  }

  await db
    .update(articles)
    .set(data)
    .where(and(eq(articles.id, id)));

  return { success: true, message: "Article updated successfully" };
}

export async function deleteArticle(id: number) {
  const user = await requireUser();

  if (!(await isArticleAuthor(user.id, id))) {
    throw new Error("❌ Forbidden");
  }

  await db.delete(articles).where(eq(articles.id, id));

  return { success: true, message: "Article deleted successfully" };
}
