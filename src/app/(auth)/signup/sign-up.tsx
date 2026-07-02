"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signUpFormSchema } from "@/validators";
import type { SignUpForm } from "@/types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SocialAuthButtons } from "../social-auth-buttons";

export function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      },
    );
  }

  return (
    <>
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold mb-4">
            Sign Up
          </CardTitle>

          <SocialAuthButtons />

          <div className="pt-6 flex items-center text-sm text-neutral-500 before:flex-1 before:border-t before:border-neutral-200 before:me-3 after:flex-1 after:border-t after:border-neutral-200 after:ms-3 dark:text-neutral-200 dark:before:border-neutral-600 dark:after:border-neutral-600">
            Or continue with
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-destructive text-center mb-4">{error}</p>
          )}
          <form id="sign-up-form" onSubmit={handleSubmit(handleSignUp)}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && <FieldError errors={[errors.password]} />}
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <FieldError errors={[errors.confirmPassword]} />
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field>
            <Button disabled={isSubmitting} type="submit" form="sign-up-form">
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <div className="text-sm text-center mt-4">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link href="/signin" className="hover:underline">
          Sign In
        </Link>
      </div>
    </>
  );
}
