"use client";
import { useState } from "react";
import MarketHeader from "@/components/MarketHeader";
import NavigationBar from "@/components/NavigationBar";
import ItemList from "@/components/ItemList";
import AddItemButton from "@/components/AddItemButton";
import AddItemModal from "@/components/AddItemModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("default");

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="">
      <MarketHeader
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />
      <ItemList selectedLocation={selectedLocation} />
      <AddItemButton onClick={() => setIsModalOpen(true)} />
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLocation={selectedLocation}
      />
      <NavigationBar />
    </div>
  );
}
