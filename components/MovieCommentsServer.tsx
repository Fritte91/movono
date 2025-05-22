import { createSupabaseServerClient } from '@/lib/supabase';
import MovieCommentsClient from '@/components/MovieCommentsClient';

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

interface MovieCommentsServerProps {
  movieId: string;
}

export default async function MovieCommentsServer({ movieId }: MovieCommentsServerProps) {
  const supabase = createSupabaseServerClient();
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      id,
      movie_id,
      user_id,
      content,
      created_at,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return <div className="text-red-500">Error loading comments</div>;
  }

  return <MovieCommentsClient movieId={movieId} initialComments={comments || []} />;
}