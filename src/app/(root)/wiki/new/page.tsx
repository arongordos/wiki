import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import WikiEditor from "@/components/wiki-editor";

export default async function NewArticlePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");

  return <WikiEditor />;
}
