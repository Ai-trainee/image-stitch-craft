
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LayoutOptions from "@/components/LayoutOptions";
import OptionsPanel from "@/components/OptionsPanel";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import { createSplicedImage, downloadImage } from "@/lib/image-processing";
import { isImageFile } from "@/lib/image-types";

const ImageSplicingTool: React.FC = () => {
  const { toast } = useToast();
  const [layout, setLayout] = useState<"single" | "row" | "grid">("grid");
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [spacing, setSpacing] = useState(0);
  const [autoSize, setAutoSize] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Handle paste events
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const files = Array.from(e.clipboardData.files);
        const imageFiles = files.filter(isImageFile);
        
        if (imageFiles.length > 0) {
          setImages(prev => [...prev, ...imageFiles]);
          toast({
            title: "图片已添加",
            description: `已添加 ${imageFiles.length} 张图片从剪贴板`,
          });
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [toast]);

  const handleImagesSelected = (files: File[]) => {
    const imageFiles = files.filter(isImageFile);
    
    if (imageFiles.length === 0) {
      toast({
        title: "无效文件",
        description: "请选择支持的图片文件格式",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => [...prev, ...imageFiles]);
    toast({
      title: "图片已添加",
      description: `已添加 ${imageFiles.length} 张图片`,
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLayoutChange = (newLayout: "single" | "row" | "grid") => {
    setLayout(newLayout);
    
    // Update rows and columns based on layout
    if (newLayout === "single") {
      setRows(1);
      setColumns(1);
    } else if (newLayout === "row") {
      setRows(images.length);
      setColumns(1);
    } else if (newLayout === "grid") {
      // Default grid layout
      setRows(2);
      setColumns(2);
    }
  };

  const handleCreateSplicedImage = async () => {
    if (images.length === 0) {
      toast({
        title: "没有图片",
        description: "请先添加图片",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const config = {
        rows: layout === "row" ? images.length : rows,
        columns: layout === "row" ? 1 : columns,
        spacing,
        format: "png",
        quality: 90,
        autoSize,
      };

      const blob = await createSplicedImage(images, config);
      downloadImage(blob, "spliced-image.png");
      
      toast({
        title: "图片已创建",
        description: "拼接图片已成功创建并下载",
      });
    } catch (error) {
      console.error("Error creating spliced image:", error);
      toast({
        title: "出错了",
        description: "创建拼接图片时出错",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white mr-2">Images Tool v3.0</h1>
          <span className="text-gray-400">视频字幕拼接工具</span>
        </div>
        <Button className="tool-button-primary">
          新操作
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-tool-secondary p-4 rounded-lg">
          <LayoutOptions 
            selectedLayout={layout} 
            onSelectLayout={handleLayoutChange} 
          />
          
          <OptionsPanel
            rows={rows}
            columns={columns}
            spacing={spacing}
            autoSize={autoSize}
            onRowsChange={setRows}
            onColumnsChange={setColumns}
            onSpacingChange={setSpacing}
            onAutoSizeChange={setAutoSize}
          />

          <div className="mt-6">
            <Button 
              className="w-full bg-tool-primary text-black hover:bg-opacity-90"
              onClick={handleCreateSplicedImage}
              disabled={isProcessing || images.length === 0}
            >
              {isProcessing ? "处理中..." : "创建拼接图片"}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <ImageUploader onImagesSelected={handleImagesSelected} />
          <ImagePreview 
            images={images} 
            onRemoveImage={handleRemoveImage} 
          />
        </div>
      </div>
    </div>
  );
};

export default ImageSplicingTool;
