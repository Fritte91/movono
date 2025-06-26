'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  movie_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

interface MovieCommentsClientProps {
  movieId: string;
  initialComments: Comment[];
}

function isValidCommentArray(arr: any): arr is Comment[] {
  return Array.isArray(arr) && arr.every(comment => comment && typeof comment.id === 'string' && typeof comment.content === 'string');
}

function isSupabaseErrorArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0 && arr[0] && typeof arr[0] === 'object' && 'error' in arr[0];
}

export default function MovieCommentsClient({ movieId, initialComments }: MovieCommentsClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        toast.error('You must be logged in to comment');
        setIsSubmitting(false);
        return;
      }

      // Check if user has a profile, create one if not
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userData.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: userData.user.id,
            username: userData.user.email?.split('@')[0] || 'Anonymous',
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          toast.error('Failed to create user profile');
          setIsSubmitting(false);
          return;
        }
      }

      // Insert the comment without returning data
      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          movie_id: movieId,
          user_id: userData.user.id,
          content: newComment,
        });

      if (insertError) {
        console.error('Supabase error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        
        toast.error(`Failed to post comment: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      // After successful insert, fetch the updated comments
      const { data: updatedComments, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          movie_id,
          user_id,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching updated comments:', fetchError);
        toast.error('Comment posted but failed to refresh comments');
        setIsSubmitting(false);
        return;
      }

      // Success case
      if (isValidCommentArray(updatedComments) && !isSupabaseErrorArray(updatedComments)) {
        setComments(updatedComments);
      } else {
        setComments([]);
      }
      setNewComment('');
      setIsSubmitting(false);
      
      toast.success('Your comment has been posted successfully', {
        duration: 3000,
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
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
                <AvatarImage src={comment.profiles?.avatar_url || '/placeholder.svg'} alt={comment.profiles?.username || 'User'} />
                <AvatarFallback>{(comment.profiles?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.profiles?.username || 'Anonymous'}</span>
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