import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import WikiEditor from "@/components/wiki-editor";
import { isArticleAuthor } from "@/db/authz";
import { getArticleById } from "@/lib/data/articles";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");

  const { id } = await params;

  const article = await getArticleById(Number(id));
  if (!article) notFound();

  const canEdit = await isArticleAuthor(session.user.id, Number(id));
  if (!canEdit) notFound();

  return (
    <WikiEditor
      title={article.title}
      content={article.content}
      published={article.published}
      isEditing={true}
      articleId={Number(id)}
    />
  );
}
