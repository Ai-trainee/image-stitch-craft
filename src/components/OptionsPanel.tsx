
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
  onRowsChange,
  onColumnsChange,
  onSpacingChange,
  onAutoSizeChange,
  onFormatChange,
  onQualityChange,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-gray-400 text-sm mb-2">图片模式</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className={cn("rounded-md flex-1", { "bg-tool-primary text-black": autoSize })}
            onClick={() => onAutoSizeChange(true)}
          >
            自动
          </Button>
          <Button
            variant="outline"
            className={cn("rounded-md flex-1", { "bg-tool-primary text-black": !autoSize })}
            onClick={() => onAutoSizeChange(false)}
          >
            统一尺寸
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-gray-400 text-sm mb-2">列数</div>
          <Select
            value={columns.toString()}
            onValueChange={(value) => onColumnsChange(parseInt(value))}
            disabled={layout === "row"}
          >
            <SelectTrigger className="bg-tool-secondary border-gray-700 text-white">
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

        <div>
          <div className="text-gray-400 text-sm mb-2">间距</div>
          <Select
            value={spacing.toString()}
            onValueChange={(value) => onSpacingChange(parseInt(value))}
          >
            <SelectTrigger className="bg-tool-secondary border-gray-700 text-white">
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

      <div>
        <div className="text-gray-400 text-sm mb-2">输出格式</div>
        <Select
          value={format}
          onValueChange={onFormatChange}
        >
          <SelectTrigger className="bg-tool-secondary border-gray-700 text-white">
            <SelectValue placeholder="png" />
          </SelectTrigger>
          <SelectContent className="bg-tool-secondary border-gray-700 text-white">
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
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
