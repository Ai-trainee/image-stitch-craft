
import React from "react";
import { cn } from "@/lib/utils";
import { Grid, Rows, Square } from "lucide-react";

interface LayoutOptionsProps {
  selectedLayout: "single" | "row" | "grid";
  onSelectLayout: (layout: "single" | "row" | "grid") => void;
}

const LayoutOptions: React.FC<LayoutOptionsProps> = ({
  selectedLayout,
  onSelectLayout,
}) => {
  return (
    <div>
      <h3 className="text-gray-400 text-sm mb-3">拼接模式</h3>
      <div className="grid grid-cols-3 gap-3">
        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "single",
          })}
          onClick={() => onSelectLayout("single")}
        >
          <div className="w-full h-12 flex items-center justify-center">
            <Square size={24} className={selectedLayout === "single" ? "text-tool-primary" : "text-gray-500"} />
          </div>
          <span className="text-xs text-gray-400">单幅</span>
        </div>

        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "row",
          })}
          onClick={() => onSelectLayout("row")}
        >
          <div className="w-full h-12 flex items-center justify-center">
            <Rows size={24} className={selectedLayout === "row" ? "text-tool-primary" : "text-gray-500"} />
          </div>
          <span className="text-xs text-gray-400">单列</span>
        </div>

        <div
          className={cn("tool-layout-option", {
            active: selectedLayout === "grid",
          })}
          onClick={() => onSelectLayout("grid")}
        >
          <div className="w-full h-12 flex items-center justify-center">
            <Grid size={24} className={selectedLayout === "grid" ? "text-tool-primary" : "text-gray-500"} />
          </div>
          <span className="text-xs text-gray-400">网格</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutOptions;
