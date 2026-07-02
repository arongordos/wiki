"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function AuthButtons() {
  const pathname = usePathname();

  return (
    <>
      <Button asChild variant="outline">
        <Link
          href={
            pathname === "/"
              ? "/signin"
              : `/signin?redirect=${encodeURIComponent(pathname)}`
          }
        >
          Sign In
        </Link>
      </Button>

      <Button asChild>
        <Link
          href={
            pathname === "/"
              ? "/signup"
              : `/signup?redirect=${encodeURIComponent(pathname)}`
          }
        >
          Sign Up
        </Link>
      </Button>
    </>
  );
}
