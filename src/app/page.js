import MarketHeader from "@/components/MarketHeader";
import { Home as HomeIcon, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import NavigationBar from "@/components/NavigationBar";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MarketHeader />
      {/* 기존 컨텐츠 */}
      <NavigationBar />
    </div>
  );
}
