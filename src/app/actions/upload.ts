"use server";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export type UploadedFile = {
  url: string;
  size: number;
  type: string;
  filename?: string;
};

export async function uploadFile(formData: FormData): Promise<UploadedFile> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("❌ Unauthorized");
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      size: file.size,
      type: file.type,
      filename: blob.pathname,
    };
  } catch (err) {
    console.error("❌ Vercel Blob upload error:", err);
    throw new Error("Upload failed");
  }
}

export async function deleteFile(id: number, url: string) {
  await del(url);
  await db.update(articles).set({ imageUrl: null }).where(eq(articles.id, id));
}
