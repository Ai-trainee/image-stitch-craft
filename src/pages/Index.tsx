
import ImageSplicingTool from "@/components/ImageSplicingTool";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tool-dark to-gray-900 pb-10">
      <header className="border-b border-gray-800 bg-tool-dark/80 backdrop-blur-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-tool-primary flex items-center justify-center text-black font-bold">
              IT
            </div>
            <h1 className="text-lg font-bold text-white">ImagesTool</h1>
          </div>
          <div className="text-sm text-gray-400">
            专业图片拼接工具
          </div>
        </div>
      </header>
      
      <main className="pt-6">
        <ImageSplicingTool />
      </main>
      
      <footer className="mt-10 container mx-auto p-4 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>支持快捷键 Ctrl+V 粘贴图片 | Ctrl+C 复制拼接结果</p>
      </footer>
    </div>
  );
};

export default Index;
