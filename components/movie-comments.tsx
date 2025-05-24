"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import toast from "react-hot-toast"

interface Comment {
  id: string
  user: {
    name: string
    avatar?: string
  }
  text: string
  date: Date
}

interface MovieCommentsProps {
  movieId: string
  initialComments?: Comment[]
}

export function MovieComments({ movieId, initialComments = [] }: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      text: newComment,
      date: new Date(),
    }

    setComments([comment, ...comments])
    setNewComment("")

    toast.success("Your comment has been added successfully.")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>

      <div className="space-y-4">
        <Textarea
          placeholder="Share your thoughts about this movie..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </div>

      <div className="space-y-6 mt-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {comment.date.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Be the first to comment on this movie!</p>
          </div>
        )}
      </div>
    </div>
  )
}
