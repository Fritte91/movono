'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  movie_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  avatar_url?: string; // Added for future avatar support
}

interface MovieCommentsClientProps {
  movieId: string;
  initialComments: Comment[];
}

export default function MovieCommentsClient({ movieId, initialComments }: MovieCommentsClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();

      if (userError || !userData.user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to comment',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const username = userData.user.user_metadata.username || 'Anonymous';
      
      const { data, error } = await supabaseClient
        .from('comments')
        .insert({
          movie_id: movieId,
          user_id: userData.user.id,
          username,
          content: newComment,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        toast({
          title: 'Error',
          description: `Failed to post comment: ${error.message}`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Success case
      setComments([data, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: 'Success',
        description: 'Your comment has been posted successfully',
        duration: 3000,
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </Button>
      </form>

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatar_url || '/placeholder.svg'} alt={comment.username} />
                <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}