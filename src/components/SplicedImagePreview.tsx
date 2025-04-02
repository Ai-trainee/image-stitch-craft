
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Copy, Download, X } from "lucide-react";
import { copyImageToClipboard } from "@/lib/image-processing";

interface SplicedImagePreviewProps {
  imageUrl: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
  onClose: () => void;
  onDownload: () => void;
}

const SplicedImagePreview: React.FC<SplicedImagePreviewProps> = ({
  imageUrl,
  blob,
  canvas,
  onClose,
  onDownload,
}) => {
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C or Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && imageUrl) {
        handleCopy();
      }
      // Escape key to close
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageUrl, canvas, onClose]);

  const handleCopy = async () => {
    if (!canvas) return;
    
    const success = await copyImageToClipboard(canvas);
    
    if (success) {
      toast({
        title: "已复制到剪贴板",
        description: "图片已成功复制到剪贴板",
      });
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    } else {
      toast({
        title: "复制失败",
        description: "无法复制图片到剪贴板，请尝试使用下载按钮",
        variant: "destructive",
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (imageUrl) {
      e.preventDefault();
      // Could implement a custom context menu here if needed
      handleCopy();
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-tool-secondary rounded-lg p-4 max-w-[90vw] max-h-[90vh] overflow-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
        
        <div className="mb-4 text-white text-center">
          <h3 className="text-lg font-semibold">拼接图片预览</h3>
          <p className="text-sm text-gray-400">按 Ctrl+C 或右键可复制图片</p>
        </div>
        
        <div className="relative group border border-gray-700 rounded-md overflow-hidden bg-tool-dark/50 backdrop-blur-sm">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Spliced result"
            className="max-w-full max-h-[70vh] object-contain"
            onContextMenu={handleContextMenu}
          />
          
          {showCopyTooltip && (
            <div className="absolute top-4 right-4 bg-tool-primary text-black px-3 py-1 rounded-full text-sm">
              已复制!
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center space-x-3">
          <Button 
            className="bg-tool-secondary border border-gray-700 hover:bg-gray-700 text-white"
            onClick={handleCopy}
          >
            <Copy size={16} className="mr-2" /> 复制图片
          </Button>
          <Button 
            className="bg-tool-primary text-black hover:bg-opacity-90"
            onClick={onDownload}
          >
            <Download size={16} className="mr-2" /> 下载图片
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplicedImagePreview;
