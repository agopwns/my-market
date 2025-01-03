'use client'
import { useQuery } from '@tanstack/react-query'
import ItemCard from './ItemCard'
import { fetchItems } from '@/lib/api'
import { useState } from 'react'

const ItemList = ({ selectedLocation }) => {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ["items", selectedLocation],
    queryFn: () => fetchItems(selectedLocation)
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        에러가 발생했습니다: {error.message}
      </div>
    )
  }

  return (
    <div className="w-full">
      {items?.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemList 