"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import { transliterate } from "./transliterate"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, StopCircle } from "lucide-react";

const chatInputVariants = cva(
    "relative w-full rounded-xl border bg-background shadow-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-ring",
    {
        variants: {
            size: {
                default: "max-w-3xl",
                full: "max-w-full",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
)

interface ChatInputProps extends VariantProps<typeof chatInputVariants> {
    variant?: "input" | "textarea"
    placeholder?: string
    onSend?: (value: string) => void
    className?: string
    containerClassName?: string
    inputClassName?: string
    defaultLanguage?: "am" | "en" // Added prop
}

export function KewtiInput({
    variant = "input",
    placeholder = "Type...",
    onSend,
    size,
    className,
    containerClassName,
    inputClassName,
    defaultLanguage = "am", // Defaults to Amharic
}: ChatInputProps) {
    const [value, setValue] = React.useState("")
    const [options, setOptions] = React.useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [language, setLanguage] = React.useState<"am" | "en">(defaultLanguage)
    const [recording, setRecording] = React.useState(false);

    const inputRef = React.useRef<HTMLTextAreaElement | HTMLInputElement | null>(null)

    // Auto-expand logic
    React.useEffect(() => {
        if (variant === "textarea" && inputRef.current) {
            const el = inputRef.current as HTMLTextAreaElement
            el.style.height = "auto"
            const newHeight = Math.min(el.scrollHeight, 120)
            el.style.height = `${newHeight}px`
        }
    }, [value, variant])

    const getCurrentWord = (text: string) => text.match(/(\S+)$/)?.[0] || ""

    const replaceCurrentWord = (text: string, replacement: string) =>
        text.replace(/(\S+)$/, replacement)

    const Record = () => {
        
        setRecording(!recording);
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)

        // Only transliterate if language is Amharic
        if (language !== "am") {
            setOptions([])
            return
        }

        setSelectedIndex(0)
        const currentWord = getCurrentWord(newValue)
        if (!currentWord.trim()) {
            setOptions([])
            return
        }

        const list = transliterate(currentWord)
        const unique = Array.from(new Set([...list, currentWord]))

        if (unique.length > 1) {
            setOptions(unique)
        } else {
            setOptions([])
            setSelectedIndex(0)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const hasOptions = options.length > 0

        // Only handle selection logic if in Amharic mode and options exist
        if (language === "am" && hasOptions) {
            if (e.key === " ") {
                e.preventDefault()
                setValue(replaceCurrentWord(value, options[selectedIndex]) + " ")
                setOptions([])
                setSelectedIndex(0)
                return
            }

            const isNext = e.key === "ArrowRight" || e.key === "ArrowDown"
            const isPrev = e.key === "ArrowLeft" || e.key === "ArrowUp"

            if (isNext || isPrev) {
                e.preventDefault()
                const step = isNext ? 1 : -1
                const nextIdx = (selectedIndex + step + options.length) % options.length
                setSelectedIndex(nextIdx)
                setValue(replaceCurrentWord(value, options[nextIdx]))
                return
            }
        }

        // Standard Enter behavior
        if (e.key === "Enter" && (variant === "input" || !e.shiftKey)) {
            e.preventDefault()
            if (value.trim()) {
                onSend?.(value)
                setValue("")
                setOptions([])
                setSelectedIndex(0)
            }
        }
    }

    const toggleLanguage = () => {
        setLanguage(prev => prev === "am" ? "en" : "am")
        setOptions([])
        inputRef.current?.focus()
    }

    const sharedClassNames = cn(
        "w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-l-none focus:ring-0 focus-visible:ring-0",
        variant === "textarea" ? "resize-none overflow-y-auto" : "",
        inputClassName
    )

    return (
        <div className={cn("w-full p-4", containerClassName)}>
            <div className={cn(chatInputVariants({ size }), className)}>

                {options.length > 0 && language === "am" && (
                    <div className="absolute -top-12 left-4 z-20 flex items-center gap-1 rounded-xl border bg-popover px-2 py-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    setValue(replaceCurrentWord(value, opt) + " ")
                                    setOptions([])
                                    setSelectedIndex(0)
                                    inputRef.current?.focus()
                                }}
                                className={cn(
                                    "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                                    idx === selectedIndex
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center">
                    <div className="">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8  transition-colors",
                            )}
                            onClick={toggleLanguage}
                            title={language === "am" ? "Switch to English" : "Switch to Amharic"}
                        >
                            <span className="text-[10px] font-bold">
                                {language === "am" ? "አማ" : "EN"}
                            </span>
                        </Button>
                    </div>

                    {variant === "textarea" ? (
                        <Textarea
                            ref={(el) => { inputRef.current = el }}
                            className={sharedClassNames}
                            value={value}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            rows={1}
                        />
                    ) : (
                        <Input
                            ref={(el) => { inputRef.current = el }}
                            className={sharedClassNames}
                            type="text"
                            value={value}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                        />
                    )}
                    <Button onClick={() => {Record();}} variant="ghost" size="sm" className="mt-4">
                        {recording? <StopCircle className="h-5 w-6" /> : <Mic className="h-5 w-6" />}
                    </Button>
                </div>
            </div>
            <div className="mt-2 flex justify-center gap-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
                    {language === "am" ? "Arrows to select • Space to lock • " : ""}
                    {variant === "textarea" ? "Enter to send" : "Enter"}
                </p>
            </div>
        </div>
    )
}