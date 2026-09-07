"use client";

import * as React from "react";
import { Clock, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // "08:30" in 24h format
  onChange?: (val: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
}

// Format 24h string ("08:30") to friendly 12h display ("08:30 AM")
export function formatTime12h(time24?: string): string {
  if (!time24) return "—";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  if (isNaN(h)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

const COMMON_TIMES = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

export function TimePicker({
  value = "09:00",
  onChange,
  className,
  placeholder = "Pick time",
  disabled,
  align = "start",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [currentHour, currentMin] = React.useMemo(() => {
    if (!value) return ["09", "00"];
    const [h, m] = value.split(":");
    return [h || "09", m || "00"];
  }, [value]);

  const handleSelectTime = (time: string) => {
    onChange?.(time);
    setIsOpen(false);
  };

  const handleHourChange = (newHour: string) => {
    onChange?.(`${newHour}:${currentMin}`);
  };

  const handleMinChange = (newMin: string) => {
    onChange?.(`${currentHour}:${newMin}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn(
              "h-8 justify-between gap-1.5 px-2.5 font-mono text-xs font-medium border-border/80 bg-background hover:bg-muted/40",
              className
            )}
          >
            <span className="flex items-center gap-1.5 text-foreground truncate">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {value ? formatTime12h(value) : <span className="text-muted-foreground">{placeholder}</span>}
            </span>
          </Button>
        }
      />
      <PopoverContent className="w-[270px] max-w-[calc(100vw-24px)] p-3 bg-popover text-popover-foreground border-border shadow-lg z-50" align={align}>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Select Time
            </span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {formatTime12h(value)}
            </span>
          </div>

          {/* Hour and Minute Selectors */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                Hour
              </span>
              <ScrollArea className="h-32 rounded-md border border-border/60 p-1 bg-muted/20">
                <div className="space-y-0.5">
                  {HOURS.map((hr) => {
                    const isSelected = hr === currentHour;
                    const hNum = parseInt(hr, 10);
                    const period = hNum >= 12 ? "PM" : "AM";
                    const h12 = hNum % 12 === 0 ? 12 : hNum % 12;
                    return (
                      <button
                        key={hr}
                        type="button"
                        onClick={() => handleHourChange(hr)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded text-xs font-mono flex items-center justify-between transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span>{h12.toString().padStart(2, "0")} {period}</span>
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                Minute
              </span>
              <ScrollArea className="h-32 rounded-md border border-border/60 p-1 bg-muted/20">
                <div className="space-y-0.5">
                  {MINUTES.map((mn) => {
                    const isSelected = mn === currentMin;
                    return (
                      <button
                        key={mn}
                        type="button"
                        onClick={() => handleMinChange(mn)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded text-xs font-mono flex items-center justify-between transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span>:{mn}</span>
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Common Class Times
            </span>
            <div className="grid grid-cols-4 gap-1">
              {COMMON_TIMES.slice(0, 8).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSelectTime(time)}
                  className={cn(
                    "text-[10px] py-1 rounded font-mono transition-colors text-center border",
                    value === time
                      ? "bg-primary text-primary-foreground font-bold border-primary"
                      : "border-border/60 hover:bg-muted text-foreground"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
