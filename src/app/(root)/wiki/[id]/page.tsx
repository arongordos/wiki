import { headers } from "next/headers";
import { notFound } from "next/navigation";
import WikiArticleViewer from "@/components/wiki-article-viewer";
import { auth } from "@/lib/auth";
import { isArticleAuthor } from "@/db/authz";
import { getArticleById } from "@/lib/data/articles";

interface ViewArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;
  const article = await getArticleById(Number(id));

  if (!article) notFound();

  const canEdit = session?.user
    ? await isArticleAuthor(session.user.id, Number(id))
    : false;

  if (!article.published && !canEdit) notFound();

  return <WikiArticleViewer article={article} canEdit={canEdit} />;
}
