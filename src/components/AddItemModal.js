import { useState } from "react";
import { X } from "lucide-react";

const AddItemModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 상품 등록 로직 추가
    console.log({ title, price, description, image });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-6">물건 등록하기</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full p-2 bg-zinc-700 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input w-full p-2 bg-zinc-700 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full p-2 bg-zinc-700 rounded-md h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">사진</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="input w-full p-2 bg-zinc-700 rounded-md"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-white py-2 rounded-md transition-colors"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
