
import React from "react";
import { X } from "lucide-react";

interface ImagePreviewProps {
  images: File[];
  onRemoveImage: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-gray-400 text-sm mb-2">上传的图片 ({images.length})</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Upload ${index + 1}`}
              className="w-full h-24 object-cover rounded-md"
            />
            <button
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(index);
              }}
            >
              <X size={14} />
            </button>
            <div className="text-xs text-gray-400 truncate mt-1">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
