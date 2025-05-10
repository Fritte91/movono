import { Film } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-6 bg-card">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-bold">Movono</span>
          </div>

          <div className="flex gap-6 mb-4 md:mb-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Movono. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
