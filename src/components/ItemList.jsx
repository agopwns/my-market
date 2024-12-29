import ItemCard from './ItemCard';

const ItemList = () => {
  const items = [
    {
      id: 1,
      title: '아이폰15 128GB 팝니다',
      location: '합정동',
      timeAgo: '47분 전',
      price: 667917,
      comments: 42,
      likes: 39,
      image: 'item1.jpg'
    },
    {
      id: 2,
      title: '맥북 프로 M2 판매합니다',
      location: '서교동',
      timeAgo: '2시간 전',
      price: 1450000,
      comments: 23,
      likes: 67,
      image: 'item1.jpg'
    },
    {
      id: 3,
      title: '닌텐도 스위치 OLED 새제품',
      location: '망원동',
      timeAgo: '3시간 전',
      price: 348000,
      comments: 15,
      likes: 28,
      image: 'item1.jpg'  
    },
    {
      id: 4,
      title: '에어팟 프로 2세대 미개봉',
      location: '상수동',
      timeAgo: '어제',
      price: 289000,
      comments: 31,
      likes: 45,
      image: 'item1.jpg'  
    },
    {
      id: 5,
      title: '갤럭시 워치 5 실버 44mm',
      location: '연남동',
      timeAgo: '2일 전',
      price: 185000,
      comments: 8,
      likes: 19,
      image: 'item1.jpg'
    },
    {
      id: 6,
      title: '아이폰15 128GB 팝니다',
      location: '합정동',
      timeAgo: '47분 전',
      price: 667917,
      comments: 42,
      likes: 39,
      image: 'item1.jpg'
    },
    {
      id: 7,
      title: '아이폰15 128GB 팝니다',
      location: '합정동',
      timeAgo: '47분 전',
      price: 667917,
      comments: 42,
      likes: 39,
      image: 'item1.jpg'
    },
    {
      id: 8,
      title: '아이폰15 128GB 팝니다',
      location: '합정동',
      timeAgo: '47분 전',
      price: 667917,
      comments: 42,
      likes: 39,
      image: 'item1.jpg'
    },
    {
      id: 9,
      title: '아이폰15 128GB 팝니다',
      location: '합정동',
      timeAgo: '47분 전',
      price: 667917,
      comments: 42,
      likes: 39,
      image: 'item1.jpg'
    },

  ];

  return (
      <div className="w-full">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
  );
};

export default ItemList; 