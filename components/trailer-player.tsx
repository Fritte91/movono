"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface TrailerPlayerProps {
  trailerUrl: string
  title: string
  thumbnailUrl?: string
  className?: string
}

export function TrailerPlayer({ trailerUrl, title, thumbnailUrl, className }: TrailerPlayerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`relative group cursor-pointer ${className}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="icon"
              className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/20 transition-transform group-hover:scale-110"
            >
              <Play className="h-8 w-8 text-white" fill="white" />
            </Button>
          </div>
          {thumbnailUrl && (
            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt={`${title} trailer thumbnail`}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 bg-black">
        <div className="aspect-video w-full">
          <iframe
            src={trailerUrl}
            title={`${title} trailer`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}
