import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Uh oh, the page you're looking for doesn't exist.</p>
      <Button asChild variant="secondary">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
