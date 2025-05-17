import { createSupabaseServerClient } from '@/lib/supabase';
import MovieCommentsClient from '@/components/MovieCommentsClient';

interface Comment {
  id: string;
  movie_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

interface MovieCommentsServerProps {
  movieId: string;
}

export default async function MovieCommentsServer({ movieId }: MovieCommentsServerProps) {
  const supabase = createSupabaseServerClient();
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return <div className="text-red-500">Error loading comments</div>;
  }

  return <MovieCommentsClient movieId={movieId} initialComments={comments || []} />;
}