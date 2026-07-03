import { WikiCard } from "@/components/wiki-card";
import { getArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="flex flex-col gap-6">
      {articles.map(({ id, title, author, createdAt, summary }) => (
        <WikiCard
          key={id}
          title={title}
          author={author ?? "Unknown"}
          date={formatDate(createdAt)}
          summary={summary ?? "No summary available."}
          href={`/wiki/${id}`}
        />
      ))}
    </main>
  );
}
