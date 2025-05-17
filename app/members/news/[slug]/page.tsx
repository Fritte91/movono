import { getArticleBySlug, getRecentArticles, categories } from "@/lib/news-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowLeft, Share2, Bookmark, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

export default function NewsArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = getRecentArticles(3).filter((a) => a.id !== article.id)

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          href="/members/news"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded-full">
                {categories.find((c) => c.value === article.category)?.label}
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {article.publishedAt.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground">{article.excerpt}</p>

            <div className="flex items-center mt-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">By {article.author.name}</div>
                <div className="text-sm text-muted-foreground">Movono News</div>
              </div>
            </div>
          </header>

          <div className="relative aspect-[16/9] mb-8">
            <img
              src={article.coverImage || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex gap-4 mb-8">
            <div className="hidden md:flex flex-col gap-4 sticky top-24 h-fit">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Bookmark</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>

            <div className="flex-1 prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />

              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/members/news/tag/${tag}`}>
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden flex justify-center gap-4 mb-8">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </div>
        </article>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/members/news/${relatedArticle.slug}`} className="group">
                <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={relatedArticle.coverImage || "/placeholder.svg"}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{relatedArticle.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
