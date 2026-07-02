import { generateId } from "better-auth";
import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { account, user } from "./auth-schema";
import { articles } from "./schema";

async function seed() {
  console.log("🌱 Starting DB seed...");

  console.log("🧹 Truncating tables...");
  await db.execute(sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE`);
  await db.execute(sql`
  TRUNCATE TABLE
    account,
    "user",
    session,
    verification
  CASCADE
`);

  console.log("👥 Creating test user...");
  const [testUser] = await db
    .insert(user)
    .values({
      id: generateId(),
      name: "Test User",
      email: "test@example.com",
    })
    .returning({ id: user.id, email: user.email });
  await db.insert(account).values({
    id: generateId(),
    accountId: testUser.id,
    providerId: "credential",
    userId: testUser.id,
    password: await hashPassword("password123"),
  });

  console.log(
    `✅ Created test user with email: ${testUser.email} and password: password123`,
  );

  console.log("📝 Creating test articles...");
  const articlesRes = await db
    .insert(articles)
    .values([
      {
        authorId: testUser.id,
        slug: "getting-started-with-drizzle-orm",
        title: "Getting Started with Drizzle ORM",
        content:
          "Drizzle ORM has become one of my favorite tools for building type-safe applications with TypeScript. In this guide, I'll walk through setting up a project, defining your schema, and running your first migration. By the end, you'll have a solid foundation for building scalable backend applications.",
        published: true,
      },
      {
        authorId: testUser.id,
        slug: "5-productivity-tips-for-remote-developers",
        title: "5 Productivity Tips for Remote Developers",
        content:
          "Working remotely offers a lot of flexibility, but staying productive can be challenging.\n\nOver the past few years, I've experimented with different routines, tools, and workflows. The biggest improvements came from keeping a consistent schedule, limiting notifications, and planning the next day's tasks before signing off.",
        published: true,
      },
      {
        authorId: testUser.id,
        slug: "why-im-rebuilding-my-personal-website",
        title: "Why I'm Rebuilding My Personal Website",
        content:
          "My personal website has served me well for several years, but it's starting to show its age.\n\nI'm rebuilding it using a modern stack with Next.js, Drizzle ORM, and PostgreSQL. The goal is to create a faster experience, simplify content management, and have a place to share technical articles and side projects",
        published: false,
      },
    ])
    .returning();

  console.log(
    `✅ Inserted ${articlesRes.length} articles into the database.\n`,
  );

  console.log("✅ DB seed completed successfully...");
}

seed().catch(console.error);
