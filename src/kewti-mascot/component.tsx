"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import mascotImage from "./mascot.png"

interface KewtiMascotProps {
    /** Extra wrapper classes */
    className?: string
    style?: React.CSSProperties
    /** Whether the mascot should appear focused (scaled up) */
    focused?: boolean
}

export default function KewtiMascot({
    className,
    style,
    focused = false
}: KewtiMascotProps) {
    const [eyePosition, setEyePosition] = React.useState({ x: 0, y: 0 })
    const mascotRef = React.useRef<HTMLDivElement>(null)

    const mouseTarget = React.useRef({ x: 0, y: 0 })
    const currentEye = React.useRef({ x: 0, y: 0 })

    React.useEffect(() => {
        let animationFrame: number

        const animate = () => {
            currentEye.current.x +=
                (mouseTarget.current.x - currentEye.current.x) * 0.12

            currentEye.current.y +=
                (mouseTarget.current.y - currentEye.current.y) * 0.12

            setEyePosition({
                x: currentEye.current.x,
                y: currentEye.current.y,
            })

            animationFrame = requestAnimationFrame(animate)
        }

        animate()

        return () => cancelAnimationFrame(animationFrame)
    }, [])

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!mascotRef.current) return

            const rect = mascotRef.current.getBoundingClientRect()

            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const dx = e.clientX - centerX
            const dy = e.clientY - centerY

            mouseTarget.current = {
                x: Math.max(-6, Math.min(6, dx * 0.02)),
                y: Math.max(-3, Math.min(3, dy * 0.02)),
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    return (
        <div className={cn("mx-auto flex items-center justify-center", className)} style={style}>
            <div
                className={cn(
                    "relative flex items-center justify-center transition-transform duration-300",
                    focused && "scale-105",
                )}
                ref={mascotRef}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-3xl transition-all duration-300">
                        {/* Mascot Image Container */}
                        <img
                            src={mascotImage}
                            alt="Mascot"
                            className="h-full w-full object-cover transition-transform duration-300"
                            loading="lazy"
                        />

                        {/* Eyes Container with tracking eyeballs */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            data-eyes-container="true"
                        >
                            {/* Left Eye */}
                            <div
                                className="absolute w-2 h-2 rounded-full bg-black border border-black shadow-md"
                                style={{
                                    left: "40%",
                                    top: "52%",
                                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) scale(1.05)`,
                                    transition: "transform 0.1s ease-out",
                                }}
                            >
                                <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: "2px", left: "2px" }} />
                            </div>

                            {/* Right Eye */}
                            <div
                                className="absolute w-2 h-2 rounded-full bg-black border border-black shadow-md"
                                style={{
                                    right: "40%",
                                    top: "52%",
                                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) scale(1.05)`,
                                    transition: "transform 0.1s ease-out",
                                }}
                            >
                                <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: "2px", left: "2px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
