
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutOptions from "@/components/LayoutOptions";
import OptionsPanel from "@/components/OptionsPanel";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import SplicedImagePreview from "@/components/SplicedImagePreview";
import LayoutPreview from "@/components/LayoutPreview";
import { createSplicedImage, downloadImage } from "@/lib/image-processing";
import { isImageFile } from "@/lib/image-types";

const ImageSplicingTool: React.FC = () => {
  const { toast } = useToast();
  const [layout, setLayout] = useState<"single" | "row" | "grid">("grid");
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [spacing, setSpacing] = useState(0);
  const [autoSize, setAutoSize] = useState(true);
  const [format, setFormat] = useState<string>("png");
  const [quality, setQuality] = useState(90);
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<{
    url: string | null;
    blob: Blob | null;
    canvas: HTMLCanvasElement | null;
  }>({ url: null, blob: null, canvas: null });
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "edit">("upload");

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
          
          // Switch to edit tab if we're still on upload tab
          if (activeTab === "upload" && images.length === 0) {
            setActiveTab("edit");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [toast, images, activeTab]);

  // Auto-update rows for row layout based on image count
  useEffect(() => {
    if (layout === "row" && images.length > 0) {
      setRows(images.length);
      setColumns(1);
    }
  }, [layout, images.length]);

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
    
    // Switch to edit tab if we added our first images
    if (images.length === 0 && activeTab === "upload") {
      setActiveTab("edit");
    }
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
      setRows(images.length || 1);
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
        format,
        quality,
        autoSize,
      };

      const { blob, canvas } = await createSplicedImage(images, config);
      const url = URL.createObjectURL(blob);
      
      setResultImage({ url, blob, canvas });
      setShowPreview(true);
      
      toast({
        title: "图片已创建",
        description: "拼接图片已成功创建，可以复制或下载",
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

  const handleDownloadImage = () => {
    if (resultImage.blob) {
      downloadImage(resultImage.blob, `spliced-image.${format}`);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const getCurrentConfig = () => ({
    rows: layout === "row" ? images.length || 1 : rows,
    columns: layout === "row" ? 1 : columns,
    spacing,
    format,
    quality,
    autoSize,
  });

  const handleReset = () => {
    // Confirm before reset if there are images
    if (images.length > 0) {
      const confirmed = window.confirm("确定要重置所有图片和设置吗？");
      if (!confirmed) return;
    }
    
    setImages([]);
    setLayout("grid");
    setRows(2);
    setColumns(2);
    setSpacing(0);
    setAutoSize(true);
    setFormat("png");
    setQuality(90);
    setResultImage({ url: null, blob: null, canvas: null });
    setActiveTab("upload");
    
    toast({
      title: "已重置",
      description: "所有图片和设置已重置",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white mr-2">Images Tool</h1>
          <span className="text-gray-400">高级图片拼接工具</span>
        </div>
        <Button 
          className="tool-button-primary"
          onClick={handleReset}
        >
          新操作
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "edit")} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-tool-secondary">
          <TabsTrigger value="upload" className="text-white data-[state=active]:bg-tool-primary data-[state=active]:text-black">
            上传图片
          </TabsTrigger>
          <TabsTrigger value="edit" className="text-white data-[state=active]:bg-tool-primary data-[state=active]:text-black">
            布局设置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0 space-y-4">
          <ImageUploader onImagesSelected={handleImagesSelected} />
          <ImagePreview 
            images={images} 
            onRemoveImage={handleRemoveImage} 
          />
        </TabsContent>
        
        <TabsContent value="edit" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-tool-secondary p-4 rounded-lg space-y-6">
              <LayoutOptions 
                selectedLayout={layout} 
                onSelectLayout={handleLayoutChange} 
              />
              
              <OptionsPanel
                rows={rows}
                columns={columns}
                spacing={spacing}
                autoSize={autoSize}
                format={format}
                quality={quality}
                onRowsChange={setRows}
                onColumnsChange={setColumns}
                onSpacingChange={setSpacing}
                onAutoSizeChange={setAutoSize}
                onFormatChange={setFormat}
                onQualityChange={setQuality}
              />

              <LayoutPreview 
                images={images}
                config={getCurrentConfig()}
                className="h-48 mt-4 mb-4"
              />

              <div className="mt-6">
                <Button 
                  className="w-full bg-tool-primary text-black hover:bg-opacity-90"
                  onClick={handleCreateSplicedImage}
                  disabled={isProcessing || images.length === 0}
                >
                  {isProcessing ? "处理中..." : "创建拼接图片"}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  完成后可使用 Ctrl+C 复制图片
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-tool-secondary p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-4">预览区域 ({images.length} 张图片)</h3>
                
                {images.length > 0 ? (
                  <div className="relative border border-gray-700 rounded-lg overflow-hidden">
                    <LayoutPreview 
                      images={images}
                      config={getCurrentConfig()}
                      className="w-full aspect-video"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-tool-dark/30 border border-gray-700 rounded-lg p-8 h-64">
                    <p className="text-gray-500 mb-4">暂无图片，请先上传</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("upload")}
                      className="bg-transparent border-gray-700 text-gray-400 hover:text-white"
                    >
                      去上传图片
                    </Button>
                  </div>
                )}
              </div>
              
              <ImagePreview 
                images={images} 
                onRemoveImage={handleRemoveImage} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {showPreview && (
        <SplicedImagePreview
          imageUrl={resultImage.url}
          blob={resultImage.blob}
          canvas={resultImage.canvas}
          onClose={handleClosePreview}
          onDownload={handleDownloadImage}
        />
      )}
    </div>
  );
};

export default ImageSplicingTool;
