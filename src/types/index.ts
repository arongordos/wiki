import type { z } from "zod";
import type {
  createArticleSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/validators";

export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;

export type Article = z.infer<typeof createArticleSchema>;
