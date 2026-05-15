import React from "react";
import { Volume2 } from "lucide-react";

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
      className={className}
      style={{ fontFamily: font, ...style } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

interface KewtiPronounceProps {
  text: string;
  lang?: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

export function KewtiPronounce({
  text,
  lang = "am-ET",
  className = "",
  iconClassName = "",
  children,
}: KewtiPronounceProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 align-middle ${className}`}>
      {children}
      <button
        type="button"
        onClick={handleSpeak}
        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
        title={`Listen: ${text}`}
        aria-label={`Listen: ${text}`}
      >
        <Volume2 className={`w-3 h-3 md:w-4 md:h-4 ${iconClassName}`} />
      </button>
    </span>
  );
}