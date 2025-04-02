
import React, { useState, useEffect } from "react";
import { SplicedImageConfig, createPreviewLayout } from "@/lib/image-processing";

interface LayoutPreviewProps {
  images: File[];
  config: SplicedImageConfig;
  className?: string;
}

const LayoutPreview: React.FC<LayoutPreviewProps> = ({ 
  images, 
  config,
  className = ""
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const generatePreview = async () => {
      if (images.length === 0) {
        setPreviewUrl("");
        return;
      }
      
      setIsLoading(true);
      try {
        const url = await createPreviewLayout(images, config);
        if (isMounted) {
          setPreviewUrl(url);
        }
      } catch (error) {
        console.error("Failed to generate preview:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Debounce the preview generation to avoid excessive renders
    const debounceTimeout = setTimeout(generatePreview, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [images, config]);
  
  if (images.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-tool-dark/50 rounded-md border border-gray-700`}>
        <p className="text-gray-500 text-sm">请添加图片以预览布局</p>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative overflow-hidden rounded-md border border-gray-700 bg-tool-dark/50`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-tool-dark/70">
          <div className="w-6 h-6 border-2 border-tool-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : null}
      
      {previewUrl ? (
        <img 
          src={previewUrl} 
          alt="Layout preview" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">生成预览中...</p>
        </div>
      )}
    </div>
  );
};

export default LayoutPreview;
