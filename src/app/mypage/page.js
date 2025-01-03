"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // 프로필 정보 가져오기
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

        <button onClick={handleSignOut} className="btn btn-error w-full">
          로그아웃
        </button>
      </div>
    </div>
  );
}
