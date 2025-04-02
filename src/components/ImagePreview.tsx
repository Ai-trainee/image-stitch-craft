
import React, { useState } from "react";
import { X, Move } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  index: number;
  image: File;
  onRemoveImage: (index: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, index, image, onRemoveImage }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group bg-tool-secondary rounded-md p-1 border border-gray-700 transition-transform hover:scale-[1.02]"
      {...attributes}
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
      
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-90 transition-opacity cursor-move"
        {...listeners}
      >
        <Move size={16} />
      </div>
      
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
        {index + 1}
      </div>
    </div>
  );
};

interface ImagePreviewProps {
  images: File[];
  onRemoveImage: (index: number) => void;
  onReorderImages: (newOrder: File[]) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemoveImage, onReorderImages }) => {
  if (images.length === 0) {
    return null;
  }

  // Create an array of image IDs for the sortable context
  const imageIds = images.map((_, index) => `image-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = imageIds.indexOf(active.id as string);
      const newIndex = imageIds.indexOf(over.id as string);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      onReorderImages(newImages);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-400 text-sm">已上传图片 ({images.length})</h3>
        <span className="text-xs text-gray-500">拖拽中间的移动图标调整顺序</span>
      </div>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageIds} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <SortableItem 
                key={`image-${index}`}
                id={`image-${index}`}
                index={index}
                image={image}
                onRemoveImage={onRemoveImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImagePreview;
