import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import SearchModal from "./SearchModal";
import NotificationList from "./NotificationList";

const MarketHeader = ({ selectedLocation, onLocationChange }) => {
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

  const { data: locations } = useQuery({
    queryKey: ["locations_query"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unique_locations")
        .select("*");

      if (error) {
        console.error("Location query error:", error);
        throw error;
      }

      return data;
    },
  });

  const handleLocationChange = (e) => {
    onLocationChange(e.target.value);
    // React Query의 queryClient를 사용하여 items 쿼리 무효화
    queryClient.invalidateQueries(["items"]);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-zinc-900 text-white border-b border-zinc-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-20">
              <select
                className="bg-black w-full"
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                <option value="default" disabled>
                  동네 선택
                </option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.location}>
                    {location.location}
                  </option>
                ))}
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
