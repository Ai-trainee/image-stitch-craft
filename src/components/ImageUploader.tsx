
import React, { useState, useRef } from "react";
import { Image } from "lucide-react";
import { IMAGE_EXTENSIONS_DISPLAY } from "@/lib/image-types";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilesSelected = (files: FileList) => {
    const imageFiles = Array.from(files);
    onImagesSelected(imageFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed ${
        isDragging ? "border-tool-primary" : "border-gray-700"
      } rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={IMAGE_EXTENSIONS_DISPLAY.map(ext => `.${ext.name}`).join(",")}
        onChange={handleFileInputChange}
        multiple
      />
      
      <Image size={40} className="text-gray-500 mb-4" />
      
      <h3 className="text-lg font-medium text-white mb-2">
        拖入或选择图片 or Ctrl+v
      </h3>
      
      <p className="text-gray-500 text-sm mb-4">支持输入格式</p>
      
      <div className="flex flex-wrap justify-center gap-2">
        {IMAGE_EXTENSIONS_DISPLAY.map((ext) => (
          <div key={ext.name} className="flex items-center text-xs text-gray-400">
            <span className="mr-1">✓</span>
            <span>{ext.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
