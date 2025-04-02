
import React, { useState, useRef } from "react";
import { Image, ClipboardPaste } from "lucide-react";
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
      } rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 relative overflow-hidden group`}
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
      
      <div className="relative z-10">
        <div className="flex items-center justify-center">
          <Image size={36} className="text-gray-500 mb-1" />
          <ClipboardPaste size={24} className="text-tool-primary ml-2 animate-pulse" />
        </div>
        
        <h3 className="text-lg font-medium text-white mb-3">
          拖入或选择图片
        </h3>
        
        <div className="px-4 py-1.5 bg-tool-dark/50 rounded-full inline-block mb-3">
          <span className="text-tool-primary font-medium">Ctrl+V</span>
          <span className="text-gray-400 ml-1">粘贴图片</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {IMAGE_EXTENSIONS_DISPLAY.map((ext) => (
            <div key={ext.name} className="flex items-center text-xs bg-gray-800/50 px-2 py-1 rounded">
              <span className="mr-1 text-tool-primary">✓</span>
              <span className="text-gray-400">.{ext.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-tool-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default ImageUploader;
