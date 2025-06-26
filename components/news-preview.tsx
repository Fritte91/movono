import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChevronRight, Newspaper } from "lucide-react"
import { getRecentArticles, categories } from "@/lib/news-data"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function NewsPreview() {
  const recentArticles = getRecentArticles(3)

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Latest News</h2>
        </div>
        <Link href="/members/news">
          <Button variant="outline" size="sm" className="gap-1">
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentArticles.map((article) => (
          <Link key={article.id} href={`/members/news/${article.slug}`} className="group">
            <Card className="overflow-hidden h-full hover:border-primary/50 transition-colors">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    {categories.find((c) => c.value === article.category)?.label}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(new Date(article.publishedAt))}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
