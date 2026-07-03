import { generateText } from "ai";

export default async function summarizeArticle(title: string, content: string) {
  if (!title || !content.trim()) {
    throw new Error("Title and content are required for summarization.");
  }

  const prompt = `Summarize the following article based solely on its content. Highlight the main ideas, key points, and conclusions in a clear, concise, and objective manner. Keep the summary to only 1-2 sentences. Do not include information or assumptions that are not explicitly stated in the article.\n\nTitle: ${title}\n\nContent: ${content}`;

  const { text } = await generateText({
    model: "gpt-5-mini",
    instructions: "You are an assistant that writes concise factual summaries.",
    prompt,
  });

  return text.trim();
}
