import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Post, CreatePostInput } from "@/types/posts";
import { toast } from "sonner";

export const useSupabasePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      // Fetch all posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch user's likes
      let userLikes: string[] = [];
      if (user) {
        const { data: likesData } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);
        userLikes = likesData?.map(l => l.post_id) || [];
      }

      // Fetch profiles for all post authors
      const authorIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", authorIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

      // Combine data
      const enrichedPosts = (postsData || []).map(post => {
        const profile = profileMap.get(post.user_id);
        return {
          ...post,
          author_name: profile?.display_name || "Usuário",
          author_avatar: profile?.avatar_url,
          is_liked: userLikes.includes(post.id),
          is_own: user?.id === post.user_id,
        } as Post;
      });

      setPosts(enrichedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (input: CreatePostInput) => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return null;
    }

    if (!input.content.trim()) {
      toast.error("O post não pode estar vazio");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: input.content.trim(),
          emoji: input.emoji || '💭',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Post publicado!");
      await fetchPosts();
      return data as Post;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erro ao publicar post");
      return null;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Post excluído");
      await fetchPosts();
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erro ao excluir post");
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para curtir");
      return false;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return false;

    try {
      if (post.is_liked) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      await fetchPosts();
      return true;
    } catch (error) {
      console.error("Error toggling like:", error);
      return false;
    }
  };

  return {
    posts,
    loading,
    createPost,
    deletePost,
    toggleLike,
    refetch: fetchPosts,
  };
};
