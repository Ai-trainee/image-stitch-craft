
import React from "react";
import { X, Move } from "lucide-react";

interface ImagePreviewProps {
  images: File[];
  onRemoveImage: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-400 text-sm">已上传图片 ({images.length})</h3>
        <span className="text-xs text-gray-500">使用鼠标拖拽调整顺序</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative group bg-tool-secondary rounded-md p-1 border border-gray-700 transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-square overflow-hidden rounded">
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2 text-white text-xs truncate">
                  {image.name}
                </div>
              </div>
            </div>
            
            <button
              className="absolute -top-2 -right-2 bg-tool-accent text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(index);
              }}
            >
              <X size={14} />
            </button>
            
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-90 transition-opacity"
            >
              <Move size={16} />
            </button>
            
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
