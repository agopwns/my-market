"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("likes"); // 'likes' 또는 'sales'

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) {
          router.push("/signin");
          return;
        }
        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116")
          throw profileError;
        setProfile(profile);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [router]);

  // 관심 목록 조회
  const { data: likedItems } = useQuery({
    queryKey: ["likedItems", user?.id],
    queryFn: async () => {
      // 먼저 사용자가 좋아요한 아이템 ID들을 가져옵니다
      const { data: likedItemIds, error: likesError } = await supabase
        .from("likes")
        .select("item_id")
        .eq("user_id", user.id);

      if (likesError) throw likesError;

      // 가져온 ID들을 배열로 변환
      const itemIds = likedItemIds.map((like) => like.item_id);

      // 해당 ID들에 해당하는 아이템들을 조회
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds)
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // 판매 목록 조회
  const { data: salesItems } = useQuery({
    queryKey: ["salesItems", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLocationChange = async (e) => {
    const newLocation = e.target.value;
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        location: newLocation,
      });

      if (error) throw error;

      setProfile((prevProfile) => ({
        ...(prevProfile || {}),
        id: user.id,
        location: newLocation,
      }));
    } catch (error) {
      console.error("Error updating location:", error);
      alert("동네 설정 중 오류가 발생했습니다.");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">나의 땅콩</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">이메일</h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">동네 설정</h2>
          <select
            value={profile?.location || ""}
            onChange={handleLocationChange}
            className="select select-bordered w-full"
          >
            <option value="">동네를 선택하세요</option>
            <option value="yeoksam1">역삼1동</option>
            <option value="yeoksam2">역삼2동</option>
            <option value="samsung1">삼성1동</option>
            <option value="samsung2">삼성2동</option>
            <option value="cheongdam">청담동</option>
          </select>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-zinc-800">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "likes"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("likes")}
          >
            관심 목록
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "sales"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("sales")}
          >
            판매 목록
          </button>
        </div>

        {/* 아이템 목록 */}
        <div className="space-y-4">
          {activeTab === "likes" &&
            likedItems?.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/items/${item.id}`)}
                className="flex gap-4 p-4 bg-zinc-800 rounded-lg cursor-pointer"
              >
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-400">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}

          {activeTab === "sales" &&
            salesItems?.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/items/${item.id}`)}
                className="flex gap-4 p-4 bg-zinc-800 rounded-lg cursor-pointer"
              >
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-400">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
        </div>

        <button onClick={handleSignOut} className="btn btn-error w-full">
          로그아웃
        </button>
      </div>
    </div>
  );
}
