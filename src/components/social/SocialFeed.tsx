import { MessageSquare } from "lucide-react";
import { Post } from "@/types/posts";
import { AchievementShare } from "@/types/achievement-sharing";
import { Achievement } from "@/types/achievements";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { AchievementShareCard } from "@/components/achievements/AchievementShareCard";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

// Combined feed item type
type FeedItem = 
  | { type: 'post'; data: Post; timestamp: string }
  | { type: 'achievement'; data: AchievementShare; achievement?: Achievement; timestamp: string };

interface SocialFeedProps {
  posts: Post[];
  achievementShares?: AchievementShare[];
  getAchievementById?: (id: string) => Achievement | undefined;
  loading: boolean;
  onCreatePost: (content: string, emoji: string) => Promise<boolean>;
  onLikePost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  userAvatar?: string | null;
  userName?: string;
}

export const SocialFeed = ({
  posts,
  achievementShares = [],
  getAchievementById,
  loading,
  onCreatePost,
  onLikePost,
  onDeletePost,
  userAvatar,
  userName,
}: SocialFeedProps) => {
  // Combine and sort all feed items by timestamp
  const feedItems: FeedItem[] = [
    ...posts.map(post => ({
      type: 'post' as const,
      data: post,
      timestamp: post.created_at,
    })),
    ...achievementShares.map(share => ({
      type: 'achievement' as const,
      data: share,
      achievement: getAchievementById?.(share.achievement_id),
      timestamp: share.created_at,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

      {/* Combined feed */}
      {feedItems.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum post ainda"
          description="Seja o primeiro a compartilhar algo com a comunidade!"
        />
      ) : (
        <div className="space-y-3">
          {feedItems.map((item) => {
            if (item.type === 'post') {
              return (
                <PostCard
                  key={`post-${item.data.id}`}
                  post={item.data}
                  onLike={onLikePost}
                  onDelete={onDeletePost}
                />
              );
            } else {
              return (
                <AchievementShareCard
                  key={`achievement-${item.data.id}`}
                  share={item.data}
                  achievement={item.achievement}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
