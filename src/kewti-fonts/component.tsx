import React from "react";
import { cn } from "@/lib/utils";

type FontName = "geez_digital" | "bela_hidase";

interface KewtiFontsProps {
  font: FontName;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function KewtiFonts({
  font,
  className,
  style,
  children,
}: KewtiFontsProps) {
  return (
    <span
      className={cn(
        font === "geez_digital" && "font-geez_digital",
        font === "bela_hidase" && "font-bela_hidase",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}