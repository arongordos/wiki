import { WikiCard } from "@/components/wiki-card";
import { getArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const articles = await getArticles();

  if (!articles.length)
    return <h2 className="text-2xl text-center">No articles found.</h2>;

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
