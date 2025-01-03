"use client";
import ChatRoom from "@/components/ChatRoom";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ChatRoomPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);

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
          <h1 className="text-xl font-bold">채팅</h1>
        </div>
      </div>
      <ChatRoom roomId={resolvedParams.id} />
    </div>
  );
}
