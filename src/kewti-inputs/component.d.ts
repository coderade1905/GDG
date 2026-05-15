import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const chatInputVariants: (props?: ({
    size?: "default" | "full" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface ChatInputProps extends VariantProps<typeof chatInputVariants> {
    variant?: "input" | "textarea";
    placeholder?: string;
    onSend?: (value: string) => void;
    className?: string;
    containerClassName?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    setUserInput?: React.Dispatch<React.SetStateAction<string>>;
    inputClassName?: string;
    defaultLanguage?: "am" | "en";
}
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}
export declare function KewtiInput({ variant, placeholder, onSend, size, className, containerClassName, inputClassName, defaultLanguage, // Defaults to Amharic
style, containerStyle, setUserInput }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
export {};
