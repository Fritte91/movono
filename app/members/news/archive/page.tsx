"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { newsArticles, categories, searchArticles, type NewsArticle } from "@/lib/news-data"
import { Calendar, Search } from "lucide-react"

export default function NewsArchivePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  let filteredArticles = searchQuery ? searchArticles(searchQuery) : [...newsArticles]

  if (selectedCategory !== "all") {
    filteredArticles = filteredArticles.filter((article) => article.category === selectedCategory)
  }

  // Sort by date (newest first)
  filteredArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">News Archive</h1>
        <p className="text-muted-foreground mt-1">Browse all our movie news and features</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-4xl mb-4">📰</div>
          <h3 className="text-lg font-medium mb-2">No Articles Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any articles matching your search criteria. Try adjusting your search or browse all our
            articles.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            View All Articles
          </Button>
        </div>
      )}
    </div>
  )
}

interface ArticleCardProps {
  article: NewsArticle
}

function ArticleCard({ article }: ArticleCardProps) {
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
          <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
