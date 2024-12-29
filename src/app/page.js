import MarketHeader from "@/components/MarketHeader";
import { Home as HomeIcon, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import NavigationBar from "@/components/NavigationBar";
import ItemList from "@/components/ItemList";
export default function Home() {
  return (
    <div className="">
      <MarketHeader />
      <ItemList />
      <NavigationBar />
    </div>
  );
}
