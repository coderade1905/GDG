import React from "react";


type FontName = "geez_digital" | "bela_hidase" | "menbere" | "abinet";

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
      style={
        { fontFamily: font, ...style } as React.CSSProperties

      }
    >
      {children}
    </span>
  );
}