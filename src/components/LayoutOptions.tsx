
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutOptionsProps {
  selectedLayout: "single" | "row" | "grid";
  onSelectLayout: (layout: "single" | "row" | "grid") => void;
}

const LayoutOptions: React.FC<LayoutOptionsProps> = ({
  selectedLayout,
  onSelectLayout,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-gray-400 text-sm mb-2">拼接模式</h3>
      <div className="flex space-x-4">
        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "single",
          })}
          onClick={() => onSelectLayout("single")}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
          <span className="text-xs text-gray-400">单幅</span>
        </div>

        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "row",
          })}
          onClick={() => onSelectLayout("row")}
        >
          <div className="w-12 h-12 flex flex-col items-center justify-center">
            <div className="w-8 h-3 bg-gray-600 rounded mb-1"></div>
            <div className="w-8 h-3 bg-gray-600 rounded"></div>
          </div>
          <span className="text-xs text-gray-400">1 专栏</span>
        </div>

        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "grid",
          })}
          onClick={() => onSelectLayout("grid")}
        >
          <div className="w-12 h-12 flex flex-col items-center justify-center">
            <div className="flex mb-1">
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded"></div>
            </div>
            <div className="flex mb-1">
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded"></div>
            </div>
            <div className="flex">
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded mr-1"></div>
              <div className="w-3 h-3 bg-tool-primary rounded"></div>
            </div>
          </div>
          <span className="text-xs text-gray-400">N 专栏</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutOptions;
