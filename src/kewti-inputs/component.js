"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { transliterate } from "./transliterate";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
const chatInputVariants = cva("relative w-full rounded-xl border bg-background shadow-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-ring", {
    variants: {
        size: {
            default: "max-w-3xl",
            full: "max-w-full",
        },
    },
    defaultVariants: {
        size: "default",
    },
});
export function KewtiInput({ variant = "input", placeholder = "Type...", onSend, size, className, containerClassName, inputClassName, defaultLanguage = "am", // Defaults to Amharic
style, containerStyle, setUserInput }) {
    const [value, setValue] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [language, setLanguage] = React.useState(defaultLanguage);
    const [supported, setSupported] = useState(true);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "am-ET";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => {
            setListening(true);
        };
        recognition.onend = () => {
            setListening(false);
        };
        recognition.onerror = (e) => {
            console.error("Speech error:", e);
        };
        recognition.onresult = (event) => {
            let text = "";
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript;
            }
            setValue(text);
            setUserInput?.(text);
        };
        recognitionRef.current = recognition;
    }, []);
    const startListening = () => {
        recognitionRef.current?.start();
    };
    const stopListening = () => {
        recognitionRef.current?.stop();
    };
    if (!supported) {
        return (_jsx("div", { className: "p-6 text-red-500", children: "Web Speech API is not supported in this browser." }));
    }
    const inputRef = React.useRef(null);
    // Auto-expand logic
    React.useEffect(() => {
        if (variant === "textarea" && inputRef.current) {
            const el = inputRef.current;
            el.style.height = "auto";
            const newHeight = Math.min(el.scrollHeight, 120);
            el.style.height = `${newHeight}px`;
        }
    }, [value, variant]);
    const getCurrentWord = (text) => text.match(/(\S+)$/)?.[0] || "";
    const replaceCurrentWord = (text, replacement) => text.replace(/(\S+)$/, replacement);
    const Record = () => {
        setListening(!listening);
        if (listening) {
            stopListening();
        }
        else {
            startListening();
        }
    };
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        setUserInput?.(newValue);
        // Only transliterate if language is Amharic
        if (language !== "am") {
            setOptions([]);
            return;
        }
        setSelectedIndex(0);
        const currentWord = getCurrentWord(newValue);
        if (!currentWord.trim()) {
            setOptions([]);
            return;
        }
        const list = transliterate(currentWord);
        const unique = Array.from(new Set([...list, currentWord]));
        if (unique.length > 1) {
            setOptions(unique);
        }
        else {
            setOptions([]);
            setSelectedIndex(0);
        }
    };
    const handleKeyDown = (e) => {
        const hasOptions = options.length > 0;
        // Only handle selection logic if in Amharic mode and options exist
        if (language === "am" && hasOptions) {
            if (e.key === " ") {
                e.preventDefault();
                setValue(replaceCurrentWord(value, options[selectedIndex]) + " ");
                setOptions([]);
                setSelectedIndex(0);
                return;
            }
            const isNext = e.key === "ArrowRight" || e.key === "ArrowDown";
            const isPrev = e.key === "ArrowLeft" || e.key === "ArrowUp";
            if (isNext || isPrev) {
                e.preventDefault();
                const step = isNext ? 1 : -1;
                const nextIdx = (selectedIndex + step + options.length) % options.length;
                setSelectedIndex(nextIdx);
                setValue(replaceCurrentWord(value, options[nextIdx]));
                return;
            }
        }
        // Standard Enter behavior
        if (e.key === "Enter" && (variant === "input" || !e.shiftKey)) {
            e.preventDefault();
            if (value.trim()) {
                onSend?.(value);
                setOptions([]);
                setSelectedIndex(0);
            }
        }
    };
    const toggleLanguage = () => {
        setLanguage(prev => prev === "am" ? "en" : "am");
        setOptions([]);
        inputRef.current?.focus();
    };
    const sharedClassNames = cn("w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-l-none focus:ring-0 focus-visible:ring-0", variant === "textarea" ? "resize-none overflow-y-auto" : "", inputClassName);
    return (_jsxs("div", { className: cn("w-full p-4", containerClassName), style: containerStyle, children: [_jsxs("div", { className: cn(chatInputVariants({ size }), className), style: style, children: [options.length > 0 && language === "am" && (_jsx("div", { className: "absolute -top-12 left-4 z-20 flex items-center gap-1 rounded-xl border bg-popover px-2 py-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-2", children: options.map((opt, idx) => (_jsx("button", { type: "button", onClick: () => {
                                setValue(replaceCurrentWord(value, opt) + " ");
                                setOptions([]);
                                setSelectedIndex(0);
                                inputRef.current?.focus();
                            }, className: cn("rounded-md px-2 py-0.5 text-xs font-medium transition-colors", idx === selectedIndex
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-muted-foreground"), children: opt }, idx))) })), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon", className: cn("h-8 w-8  transition-colors"), onClick: toggleLanguage, title: language === "am" ? "Switch to English" : "Switch to Amharic", children: _jsx("span", { className: "text-[10px] font-bold", children: language === "am" ? "አማ" : "EN" }) }) }), variant === "textarea" ? (_jsx(Textarea, { ref: (el) => { inputRef.current = el; }, className: sharedClassNames, value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: placeholder, rows: 1 })) : (_jsx(Input, { ref: (el) => { inputRef.current = el; }, className: sharedClassNames, type: "text", value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: placeholder })), _jsx(Button, { onClick: () => { Record(); }, variant: "ghost", size: "sm", className: "mt-4", children: listening ? _jsx(StopCircle, { className: "h-5 w-6" }) : _jsx(Mic, { className: "h-5 w-6" }) })] })] }), _jsx("div", { className: "mt-2 flex justify-center gap-4", children: _jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest opacity-60", children: [language === "am" ? "Arrows to select • Space to lock • " : "", variant === "textarea" ? "Enter to send" : "Enter"] }) })] }));
}
