import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getRecentArticles,
  getFeaturedArticles,
  getArticlesByCategory,
  categories,
  type NewsArticle,
} from "@/lib/news-data"
import { Calendar, ChevronRight } from "lucide-react"

export default function NewsPage() {
  const featuredArticles = getFeaturedArticles(3)
  const recentArticles = getRecentArticles(6)

  // Get articles for each category
  const industryArticles = getArticlesByCategory("industry", 4)
  const awardsArticles = getArticlesByCategory("awards", 4)
  const reviewsArticles = getArticlesByCategory("reviews", 4)
  const interviewsArticles = getArticlesByCategory("interviews", 4)
  const releasesArticles = getArticlesByCategory("releases", 4)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Movie News & Features</h1>
        <p className="text-muted-foreground mt-1">The latest updates from the world of cinema</p>
      </div>

      {/* Featured Articles */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/members/news/${article.slug}`}
              className={`group ${index === 0 ? "lg:col-span-2 row-span-2" : ""}`}
            >
              <div className="relative h-full overflow-hidden rounded-lg border border-border">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                <img
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ height: index === 0 ? "500px" : "250px" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {categories.find((c) => c.value === article.category)?.label}
                    </span>
                    <span className="text-xs text-gray-300 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.publishedAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2
                    className={`font-bold text-white ${index === 0 ? "text-2xl" : "text-lg"} group-hover:text-primary transition-colors`}
                  >
                    {article.title}
                  </h2>
                  {index === 0 && <p className="text-gray-300 mt-2 line-clamp-2">{article.excerpt}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <Link href="/members/news/archive">
            <Button variant="outline" size="sm" className="gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <Tabs defaultValue="industry" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="px-4">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="industry" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="awards" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {awardsArticles.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviewsArticles.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {interviewsArticles.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="releases" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {releasesArticles.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

interface ArticleCardProps {
  article: NewsArticle
  compact?: boolean
}

function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <Link href={`/members/news/${article.slug}`} className="group">
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
              {article.publishedAt.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {!compact && <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}
