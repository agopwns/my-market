import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NotificationList({ isOpen, onClose }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          items (title),
          comments (content)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleNotificationClick = async (notification) => {
    await markAsReadMutation.mutateAsync(notification.id);
    router.push(`/items/${notification.item_id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed top-0 right-0 h-full w-80 bg-zinc-900 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">알림</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            닫기
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg cursor-pointer ${
                  notification.is_read ? "bg-zinc-800" : "bg-zinc-700"
                }`}
              >
                <p className="text-sm">
                  내 글 &quot;{notification.items.title}&quot;에 새로운 댓글이
                  달렸습니다:
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {notification.comments.content}
                </p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
