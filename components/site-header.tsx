"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Film, Search, Bell, User, LogOut, Settings, Menu, Folder, HelpCircle, Newspaper } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Simulate logout
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/members" className="text-lg font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/members/movies" className="text-lg font-medium hover:text-primary transition-colors">
                Movies
              </Link>
              <Link href="/members/top-imdb" className="text-lg font-medium hover:text-primary transition-colors">
                Top IMDb
              </Link>
              <Link href="/members/collections" className="text-lg font-medium hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href="/members/news" className="text-lg font-medium hover:text-primary transition-colors">
                News
              </Link>
              <Link href="/members/search" className="text-lg font-medium hover:text-primary transition-colors">
                Search
              </Link>
              <Link href="/members/guide" className="text-lg font-medium hover:text-primary transition-colors">
                Download Guide
              </Link>
              <Link href="/members/profile" className="text-lg font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/members" className="flex items-center gap-2 mr-6">
          <Film className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">Movono</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/members" className="font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/members/movies" className="font-medium transition-colors hover:text-primary">
            Movies
          </Link>
          <Link href="/members/top-imdb" className="font-medium transition-colors hover:text-primary">
            Top IMDb
          </Link>
          <Link href="/members/collections" className="font-medium transition-colors hover:text-primary">
            Collections
          </Link>
          <Link href="/members/news" className="font-medium transition-colors hover:text-primary">
            News
          </Link>
          <Link href="/members/search" className="font-medium transition-colors hover:text-primary">
            Search
          </Link>
          <Link href="/members/guide" className="font-medium transition-colors hover:text-primary">
            Guide
          </Link>
        </nav>

        <div className="flex items-center ml-auto gap-2">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                className="w-[200px] sm:w-[300px] search-input"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover:bg-primary/10">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/members/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/members/profile?tab=collections" className="cursor-pointer">
                  <Folder className="mr-2 h-4 w-4" />
                  My Collections
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/members/news" className="cursor-pointer">
                  <Newspaper className="mr-2 h-4 w-4" />
                  News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/members/guide" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Download Guide
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/members/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
