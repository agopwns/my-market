"use client";
import ChatList from "@/components/ChatList";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 p-4">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>
      <ChatList />
    </div>
  );
}
