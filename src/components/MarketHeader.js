import { Bell, Search } from "lucide-react";

const MarketHeader = () => {
  return (
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
            <button className="btn btn-ghost btn-circle">
              <Search className="h-6 w-6" />
            </button>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell className="h-6 w-6" />
                <span className="badge badge-sm badge-primary indicator-item">
                  2
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketHeader;
