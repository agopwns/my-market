import { Home as HomeIcon, MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        <Link href="/" className="flex flex-col items-center">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">홈</span>
        </Link>

        <Link href="/chat" className="flex flex-col items-center">
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs mt-1">채팅</span>
        </Link>

        <Link href="/mypage" className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">나의 땅콩</span>
        </Link>
      </div>
    </nav>
  );
}
