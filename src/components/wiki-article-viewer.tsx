import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  Home,
  Trash,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { deleteArticle } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ViewerArticle {
  id: number;
  author: string | null;
  title: string;
  content: string;
  imageUrl?: string | null;
  published?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WikiArticleViewerProps {
  article: ViewerArticle;
  canEdit?: boolean;
}

export default function WikiArticleViewer({
  article,
  canEdit = false,
}: WikiArticleViewerProps) {
  return (
    <>
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="size-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="size-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center" title="Created At">
              <Calendar className="size-4 mr-1" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center" title="Updated At">
              <Clock className="size-4 mr-1" />
              <span>{formatRelativeTime(article.updatedAt)}</span>
            </div>
            <div>
              <span>
                {canEdit &&
                  (article.published ? (
                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Published
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Unpublished
                    </Badge>
                  ))}
              </span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/wiki/edit/${article.id}`}>
                <Edit className="size-4" />
                Edit Article
              </Link>
            </Button>

            <form
              id="delete-article-form"
              action={async () => {
                "use server";
                await deleteArticle(article.id);
                redirect("/");
              }}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    <Trash className="size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Article?</AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to delete this article?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      form="delete-article-form"
                      type="submit"
                      variant="destructive"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </div>
        )}
      </div>

      <Card className="shadow">
        <CardContent>
          {article.imageUrl && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={`Image for ${article.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <div>{article.content}</div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft />
            Back to Articles
          </Link>
        </Button>
      </div>
    </>
  );
}
