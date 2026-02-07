import { MessageSquare } from "lucide-react";
import { Post } from "@/types/posts";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface SocialFeedProps {
  posts: Post[];
  loading: boolean;
  onCreatePost: (content: string, emoji: string) => Promise<boolean>;
  onLikePost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  userAvatar?: string | null;
  userName?: string;
}

export const SocialFeed = ({
  posts,
  loading,
  onCreatePost,
  onLikePost,
  onDeletePost,
  userAvatar,
  userName,
}: SocialFeedProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <ContentSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create post form */}
      <CreatePostForm
        onSubmit={onCreatePost}
        userAvatar={userAvatar}
        userName={userName}
      />

      {/* Posts list */}
      {posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum post ainda"
          description="Seja o primeiro a compartilhar algo com a comunidade!"
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLikePost}
              onDelete={onDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};
