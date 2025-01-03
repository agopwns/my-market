import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import SearchModal from "./SearchModal";
import NotificationList from "./NotificationList";

const MarketHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    // 알림 테이블 구독
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // 새 알림이 생성되면 알림 목록과 개수를 갱신
          queryClient.invalidateQueries(["notifications"]);
          queryClient.invalidateQueries(["notifications", "unread"]);
        }
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, queryClient]);

  // 읽지 않은 알림 개수 조회
  const { data: unreadCount } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      if (!userId) return 0;
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return count;
    },
    enabled: !!userId,
  });

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-zinc-900 text-white border-b border-zinc-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 좌측: 동 선택 */}
            <div className="w-20">
              <select className="bg-black w-full" defaultValue="default">
                <option value="default" disabled>
                  동네 선택
                </option>
                <option value="yeoksam1">역삼1동</option>
                <option value="yeoksam2">역삼2동</option>
                <option value="samsung1">삼성1동</option>
                <option value="samsung2">삼성2동</option>
                <option value="cheongdam">청담동</option>
              </select>
            </div>

            {/* 우측: 검색 및 알림 버튼 */}
            <div className="flex items-center">
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setIsNotificationOpen(true)}
              >
                <div className="indicator">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="badge badge-sm badge-primary indicator-item">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationList
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

export default MarketHeader;
