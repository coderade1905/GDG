"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X } from "lucide-react";
import mascotImage from "./mascot.png";
import handLeftImage from "./hand-left.png";
import handRightImage from "./hand-right.png";
const RULES = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    { label: "Number", test: (pw) => /\d/.test(pw) },
    { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];
function getStrength(password) {
    if (!password)
        return 0;
    const passed = RULES.filter((r) => r.test(password)).length;
    if (passed <= 1)
        return 1;
    if (passed <= 2)
        return 2;
    if (passed <= 3)
        return 3;
    return 4;
}
const STRENGTH_CONFIG = {
    0: { label: "", color: "", bgColor: "bg-muted" },
    1: { label: "Weak", color: "text-red-500", bgColor: "bg-red-500" },
    2: { label: "Fair", color: "text-amber-500", bgColor: "bg-amber-500" },
    3: { label: "Good", color: "text-sky-500", bgColor: "bg-sky-500" },
    4: { label: "Strong", color: "text-emerald-500", bgColor: "bg-emerald-500" },
};
export function KewtiPassword({ placeholder = "Enter password", showStrength = true, onChange, value: controlledValue, label = "Password", className, mascot, setUserPassword, style }) {
    const [internalValue, setInternalValue] = React.useState("");
    const [visible, setVisible] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [eyePosition, setEyePosition] = React.useState({ x: 0, y: 0 });
    const mascotRef = React.useRef(null);
    const password = controlledValue ?? internalValue;
    const strength = getStrength(password);
    const config = STRENGTH_CONFIG[strength];
    // Eye tracking effect
    const inputRef = React.useRef(null);
    const mouseTarget = React.useRef({ x: 0, y: 0 });
    const currentEye = React.useRef({ x: 0, y: 0 });
    React.useEffect(() => {
        let animationFrame;
        const animate = () => {
            currentEye.current.x +=
                (mouseTarget.current.x - currentEye.current.x) * 0.12;
            currentEye.current.y +=
                (mouseTarget.current.y - currentEye.current.y) * 0.12;
            setEyePosition({
                x: currentEye.current.x,
                y: currentEye.current.y,
            });
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!mascotRef.current || focused)
                return;
            const rect = mascotRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            mouseTarget.current = {
                x: Math.max(-6, Math.min(6, dx * 0.02)),
                y: Math.max(-3, Math.min(3, dy * 0.02)),
            };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [focused]);
    const updateEyesFromCaret = () => {
        const input = inputRef.current;
        if (!input || !mascotRef.current)
            return;
        const caret = input.selectionStart || 0;
        // create hidden mirror
        const div = document.createElement("div");
        const span = document.createElement("span");
        const style = window.getComputedStyle(input);
        [
            "fontSize",
            "fontFamily",
            "fontWeight",
            "letterSpacing",
            "padding",
            "border",
            "width",
            "lineHeight",
        ].forEach((prop) => {
            // @ts-ignore
            div.style[prop] = style[prop];
        });
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.whiteSpace = "pre";
        div.textContent = input.value.substring(0, caret);
        span.textContent = "|";
        div.appendChild(span);
        document.body.appendChild(div);
        const caretX = span.offsetLeft;
        document.body.removeChild(div);
        const inputWidth = input.clientWidth;
        const normalized = (caretX / inputWidth - 0.5);
        mouseTarget.current = {
            x: Math.max(-6, Math.min(6, normalized * 8)),
            y: 1,
        };
    };
    const handleChange = (e) => {
        const next = e.target.value;
        if (controlledValue === undefined) {
            setInternalValue(next);
        }
        onChange?.(next);
        requestAnimationFrame(updateEyesFromCaret);
        if (setUserPassword) {
            setUserPassword(next);
        }
    };
    return (_jsxs("div", { className: cn("mx-auto w-full max-w-sm", className), style: style, children: [_jsx("div", { className: "flex items-end justify-center", children: _jsx("div", { className: cn("relative -mb-px flex items-end justify-center transition-transform duration-300", focused && "scale-105"), ref: mascotRef, children: mascot ? (mascot) : (
                    /* Mascot illustration with eyes ready for interactivity */
                    _jsxs("div", { className: "flex flex-col items-center gap-2 pb-2", children: [_jsxs("div", { className: "relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-3xl transition-all duration-300", children: [_jsx("img", { src: mascotImage, alt: "Mascot", className: "h-full w-full object-cover transition-transform duration-300", loading: "lazy" }), _jsxs("div", { className: "absolute inset-0 pointer-events-none", "data-eyes-container": "true", children: [_jsx("div", { className: "absolute w-2 h-2 rounded-full bg-black border border-black shadow-md", style: {
                                                    left: "40%",
                                                    top: "52%",
                                                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) scale(1.05)`,
                                                    transition: "transform 0.1s ease-out",
                                                }, children: _jsx("div", { className: "absolute w-0.5 h-0.5 bg-white rounded-full", style: { top: "2px", left: "2px" } }) }), _jsx("div", { className: "absolute w-2 h-2 rounded-full bg-black border border-black shadow-md", style: {
                                                    right: "40%",
                                                    top: "52%",
                                                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) scale(1.05)`,
                                                    transition: "transform 0.1s ease-out",
                                                }, children: _jsx("div", { className: "absolute w-0.5 h-0.5 bg-white rounded-full", style: { top: "2px", left: "2px" } }) })] }), _jsx("img", { src: handLeftImage, alt: "", className: "absolute pointer-events-none", style: {
                                            width: "28%",
                                            top: "48%",
                                            left: visible ? "-30%" : "26%",
                                            transform: "translateY(-50%) rotate(10deg) scale(0.9)",
                                            transition: "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                            zIndex: 10,
                                        } }), _jsx("img", { src: handRightImage, alt: "", className: "absolute pointer-events-none", style: {
                                            width: "28%",
                                            top: "48%",
                                            right: visible ? "-30%" : "26%",
                                            transform: "translateY(-50%) rotate(-10deg) scale(0.9)",
                                            transition: "right 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                            zIndex: 10,
                                        } })] }), _jsx("div", { className: cn("h-2 w-16 rounded-t-md transition-colors duration-300", focused ? "bg-primary/15" : "bg-muted/50") })] })) }) }), _jsxs("div", { className: cn("rounded-2xl border bg-background p-5 shadow-sm transition-all duration-300", focused
                    ? "border-primary/30 shadow-md shadow-primary/5 ring-1 ring-primary/10"
                    : "border-border"), children: [label && (_jsx("label", { className: "mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground", children: label })), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "kewti-password-input", type: visible ? "text" : "password", value: password, ref: inputRef, onChange: handleChange, onFocus: () => setFocused(true), onBlur: () => setFocused(false), placeholder: placeholder, autoComplete: "new-password", className: cn("peer h-11 w-full rounded-xl border bg-transparent px-4 pr-12 text-sm outline-none transition-all duration-200", "placeholder:text-muted-foreground/60", "border-input focus:border-primary focus:ring-2 focus:ring-primary/20", "dark:bg-input/20") }), _jsx("button", { type: "button", tabIndex: -1, onClick: () => setVisible((v) => !v), "aria-label": visible ? "Hide password" : "Show password", className: cn("absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors", "hover:bg-muted hover:text-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"), children: visible ? (_jsx(EyeOff, { className: "h-4 w-4" })) : (_jsx(Eye, { className: "h-4 w-4" })) })] }), showStrength && password.length > 0 && (_jsxs("div", { className: "mt-4 animate-in fade-in slide-in-from-top-1 duration-300", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx("div", { className: "flex flex-1 gap-1", children: [1, 2, 3, 4].map((level) => (_jsx("div", { className: cn("h-1.5 flex-1 rounded-full transition-all duration-500", strength >= level
                                                ? config.bgColor
                                                : "bg-muted") }, level))) }), _jsx("span", { className: cn("text-[11px] font-medium tabular-nums tracking-wide transition-colors duration-300", config.color), children: config.label })] }), _jsx("ul", { className: "space-y-1", children: RULES.map((rule) => {
                                    const passed = rule.test(password);
                                    return (_jsxs("li", { className: cn("flex items-center gap-1.5 text-[11px] transition-colors duration-200", passed
                                            ? "text-emerald-500"
                                            : "text-muted-foreground/70"), children: [passed ? (_jsx(Check, { className: "h-3 w-3" })) : (_jsx(X, { className: "h-3 w-3" })), rule.label] }, rule.label));
                                }) })] }))] })] }));
}
