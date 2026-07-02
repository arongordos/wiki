"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  OAUTH_PROVIDER_DETAILS,
  OAUTH_PROVIDERS,
} from "@/lib/o-auth-providers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function SocialAuthButtons() {
  const searchParams = useSearchParams();

  return OAUTH_PROVIDERS.map((provider) => {
    const image = OAUTH_PROVIDER_DETAILS[provider].image;

    return (
      <Button
        variant="outline"
        key={provider}
        onClick={async () =>
          await authClient.signIn.social({
            provider,
            callbackURL: searchParams.get("redirect") || "/",
          })
        }
      >
        <Image
          src={image}
          alt={provider}
          width={20}
          height={20}
          className={cn(provider === "github" && "dark:invert")}
        />
        {OAUTH_PROVIDER_DETAILS[provider].name}
      </Button>
    );
  });
}
