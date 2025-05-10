import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>

            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-12 w-3/4 mb-3" />
            <Skeleton className="h-6 w-full mb-6" />

            <div className="flex items-center mt-6">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </header>

          <Skeleton className="w-full aspect-[16/9] mb-8 rounded-lg" />

          <div className="flex gap-4 mb-8">
            <div className="hidden md:flex flex-col gap-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
            </div>

            <div className="flex-1 space-y-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}

              <div className="flex flex-wrap gap-2 mt-8">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                  ))}
              </div>
            </div>
          </div>
        </article>

        <section className="mt-12 border-t border-border pt-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}
