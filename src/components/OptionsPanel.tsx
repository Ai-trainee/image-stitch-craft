
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  rows: number;
  columns: number;
  spacing: number;
  autoSize: boolean;
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
  onSpacingChange: (spacing: number) => void;
  onAutoSizeChange: (autoSize: boolean) => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  rows,
  columns,
  spacing,
  autoSize,
  onRowsChange,
  onColumnsChange,
  onSpacingChange,
  onAutoSizeChange,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-gray-400 text-sm">模式</h3>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className={cn("rounded-md", { "bg-tool-primary text-black": autoSize })}
          onClick={() => onAutoSizeChange(true)}
        >
          auto
        </Button>
        <Button
          variant="outline"
          className={cn("rounded-md", { "bg-tool-primary text-black": !autoSize })}
          onClick={() => onAutoSizeChange(false)}
        >
          定制尺寸
        </Button>
        <Button
          variant="outline"
          className="rounded-md"
        >
          弹布
        </Button>
      </div>

      <div className="flex space-x-3">
        <div className="w-1/3">
          <div className="text-gray-400 text-sm mb-2">列数</div>
          <Select
            value={columns.toString()}
            onValueChange={(value) => onColumnsChange(parseInt(value))}
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

        <div className="w-1/3">
          <div className="text-gray-400 text-sm mb-2">图片模式</div>
          <Select
            value={"auto"}
            onValueChange={() => {}}
          >
            <SelectTrigger className="bg-tool-secondary border-gray-700 text-white">
              <SelectValue placeholder="auto" />
            </SelectTrigger>
            <SelectContent className="bg-tool-secondary border-gray-700 text-white">
              <SelectItem value="auto">auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-1/3">
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
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;
