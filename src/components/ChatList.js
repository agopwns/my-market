import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatList() {
  const [userId, setUserId] = useState(null);

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

  const { data: chatRooms, isLoading } = useQuery({
    queryKey: ["chatRooms", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("chat_room_details")
        .select("*")
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800">
      {chatRooms?.map((room) => (
        <Link key={room.id} href={`/chat/${room.id}`}>
          <div className="flex items-center gap-4 p-4 hover:bg-zinc-800">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={room.item_image}
                alt={room.item_title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{room.item_title}</h3>
              <p className="text-sm text-gray-400">
                {userId === room.seller_id
                  ? room.buyer_email
                  : room.seller_email}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(room.updated_at).toLocaleDateString()}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
