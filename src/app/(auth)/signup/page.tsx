import { auth } from "@/lib/auth";
import { SignUp } from "./sign-up";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) redirect("/");

  return <SignUp />;
}
