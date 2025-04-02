
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  rows: number;
  columns: number;
  spacing: number;
  autoSize: boolean;
  format: string;
  quality: number;
  layout: "single" | "row" | "grid";
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
  onSpacingChange: (spacing: number) => void;
  onAutoSizeChange: (autoSize: boolean) => void;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number) => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  rows,
  columns,
  spacing,
  autoSize,
  format,
  quality,
  layout,
  onRowsChange,
  onColumnsChange,
  onSpacingChange,
  onAutoSizeChange,
  onFormatChange,
  onQualityChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-gray-400 text-sm mb-2">图片模式</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className={cn("rounded-md flex-1 h-9", { "bg-tool-primary text-black": autoSize })}
            onClick={() => onAutoSizeChange(true)}
          >
            <span className={autoSize ? "text-black" : "text-gray-300"}>保持原尺寸</span>
          </Button>
          <Button
            variant="outline"
            className={cn("rounded-md flex-1 h-9", { "bg-tool-primary text-black": !autoSize })}
            onClick={() => onAutoSizeChange(false)}
          >
            <span className={!autoSize ? "text-black" : "text-gray-300"}>统一尺寸</span>
          </Button>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {autoSize 
            ? "保持每张图片原始尺寸，可能大小不一" 
            : "所有图片调整为第一张图片的尺寸"}
        </div>
      </div>

      {layout !== "single" && (
        <div className="grid grid-cols-2 gap-3">
          {layout === "grid" && (
            <div>
              <div className="text-gray-400 text-sm mb-2">行数</div>
              <Select
                value={rows.toString()}
                onValueChange={(value) => onRowsChange(parseInt(value))}
              >
                <SelectTrigger className="bg-tool-secondary border-gray-700 text-white h-9">
                  <SelectValue placeholder="2" />
                </SelectTrigger>
                <SelectContent className="bg-tool-secondary border-gray-700 text-white">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {layout === "grid" && (
            <div>
              <div className="text-gray-400 text-sm mb-2">列数</div>
              <Select
                value={columns.toString()}
                onValueChange={(value) => onColumnsChange(parseInt(value))}
              >
                <SelectTrigger className="bg-tool-secondary border-gray-700 text-white h-9">
                  <SelectValue placeholder="2" />
                </SelectTrigger>
                <SelectContent className="bg-tool-secondary border-gray-700 text-white">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className={layout === "grid" ? "col-span-2" : "col-span-2"}>
            <div className="text-gray-400 text-sm mb-2">间距</div>
            <Select
              value={spacing.toString()}
              onValueChange={(value) => onSpacingChange(parseInt(value))}
            >
              <SelectTrigger className="bg-tool-secondary border-gray-700 text-white h-9">
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent className="bg-tool-secondary border-gray-700 text-white">
                {[0, 5, 10, 15, 20, 30].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <div className="text-gray-400 text-sm mb-2">输出格式</div>
        <Select
          value={format}
          onValueChange={onFormatChange}
        >
          <SelectTrigger className="bg-tool-secondary border-gray-700 text-white h-9">
            <SelectValue placeholder="png" />
          </SelectTrigger>
          <SelectContent className="bg-tool-secondary border-gray-700 text-white">
            <SelectItem value="png">PNG (无损)</SelectItem>
            <SelectItem value="jpeg">JPEG (有损)</SelectItem>
            <SelectItem value="webp">WebP (高压缩)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {format === "jpeg" || format === "webp" ? (
        <div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">画质</span>
            <span className="text-gray-400 text-sm">{quality}%</span>
          </div>
          <div className="mt-2">
            <Slider
              value={[quality]}
              min={10}
              max={100}
              step={5}
              onValueChange={(value) => onQualityChange(value[0])}
              className="bg-transparent"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OptionsPanel;
