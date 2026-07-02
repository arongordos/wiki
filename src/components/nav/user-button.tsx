"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function UserButton() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const firstInitial = session?.user.name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {session?.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            firstInitial
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuLabel className="font-semibold text-foreground text-base pb-0">
          {session?.user.name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="pt-0 text-sm">
          {session?.user.email}
        </DropdownMenuLabel>

        <DropdownMenuItem className="p-0">
          <Button
            variant="destructive"
            className="w-full"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
              router.refresh();
            }}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
