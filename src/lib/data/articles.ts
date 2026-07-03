import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, user } from "@/db/schema";

export async function getArticles() {
  const response = await db
    .select({
      id: articles.id,
      author: user.name,
      title: articles.title,
      content: articles.content,
      summary: articles.summary,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt))
    .leftJoin(user, eq(articles.authorId, user.id));

  return response;
}

export async function getArticleById(id: number) {
  const response = await db
    .select({
      id: articles.id,
      author: user.name,
      title: articles.title,
      content: articles.content,
      imageUrl: articles.imageUrl,
      published: articles.published,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(user, eq(articles.authorId, user.id));

  return response[0];
}
