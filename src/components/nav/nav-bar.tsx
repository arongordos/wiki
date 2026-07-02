import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/nav/user-button";
import { auth } from "@/lib/auth";
import { PlusIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "../ui/separator";

export async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="w-full border-b bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <span className="rounded px-1 py-0.5 bg-sky-500 dark:bg-sky-800 text-white font-bold">
            W
          </span>
          <Link href="/" className="font-bold text-xl text-foreground">
            Wiki
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Separator orientation="vertical" />

          {session?.user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/wiki/new">
                  <PlusIcon /> New Article
                </Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>

              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
