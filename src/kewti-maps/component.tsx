import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type MapItem = { name: string; src: string; displayName: string }

type Props = {
  initial?: string
  onChange?: (item: MapItem | undefined) => void
  onRegionSelect?: (info: { map: string; regionIndex: number }) => void
  showPreview?: boolean
  label?: string
}

// Import the SVG as raw text (Vite `?raw`). If TypeScript complains, the tsconfig
// may need a `declare module '*.svg?raw'` entry; ignore TS here for simplicity.
// @ts-ignore
import mapRaw from './maps/map.svg?raw'

export function KewtiMap({ initial, onChange, onRegionSelect, showPreview = true, label = 'Select Map' }: Props) {
  const svgContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null)

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    // Inline the raw SVG markup
    container.innerHTML = mapRaw || ''

    const svg = container.querySelector('svg') as SVGElement | null
    if (svg) {
      svg.style.width = '100%'
      svg.style.height = '100%'
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    }

    const regionSelector = 'path, rect, polygon, circle, g'
    const regions = Array.from(container.querySelectorAll(regionSelector)) as Element[]

    const cleanup: Array<{ el: Element; click: EventListenerOrEventListenerObject; keydown: EventListenerOrEventListenerObject; prevStroke?: string | null; prevStrokeWidth?: string | null }> = []

    const mapName = 'map'

    regions.forEach((el, i) => {
      el.setAttribute('data-region-index', String(i))
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')
      ;(el as HTMLElement).style.cursor = 'pointer'

      const prevStroke = el.getAttribute('stroke')
      const prevStrokeWidth = el.getAttribute('stroke-width')

      const handleClick = (e: Event) => {
        e.stopPropagation()

        // Clear previous highlight
        cleanup.forEach((r) => {
          if (r.el.getAttribute('data-kewti-selected') === 'true') {
            if (r.prevStroke != null) r.el.setAttribute('stroke', r.prevStroke)
            else r.el.removeAttribute('stroke')
            if (r.prevStrokeWidth != null) r.el.setAttribute('stroke-width', r.prevStrokeWidth)
            else r.el.removeAttribute('stroke-width')
            r.el.removeAttribute('data-kewti-selected')
          }
        })

        // Apply highlight to the clicked element
        el.setAttribute('data-kewti-selected', 'true')
        el.setAttribute('stroke', '#2b6ef6')
        el.setAttribute('stroke-width', '6')

        setSelectedRegion(i)
        onRegionSelect?.({ map: mapName, regionIndex: i })
      }

      const handleKey = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault()
          handleClick(ev as unknown as Event)
        }
      }

      el.addEventListener('click', handleClick)
      el.addEventListener('keydown', handleKey as EventListener)

      cleanup.push({ el, click: handleClick, keydown: handleKey, prevStroke, prevStrokeWidth })
    })

    return () => {
      cleanup.forEach((r) => {
        r.el.removeEventListener('click', r.click)
        r.el.removeEventListener('keydown', r.keydown as EventListener)
        if (r.el.getAttribute('data-kewti-selected') === 'true') {
          if (r.prevStroke != null) r.el.setAttribute('stroke', r.prevStroke)
          else r.el.removeAttribute('stroke')
          if (r.prevStrokeWidth != null) r.el.setAttribute('stroke-width', r.prevStrokeWidth)
          else r.el.removeAttribute('stroke-width')
          r.el.removeAttribute('data-kewti-selected')
        }
      })
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
      </label>

      <div className="relative w-full h-80 rounded-lg border border-border overflow-hidden bg-muted/30 flex items-center justify-center">
        <div ref={svgContainerRef} className="w-full h-full" />

        <div className="absolute left-3 top-3 px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm">
          <span className="text-xs font-medium text-white">SVG Map</span>
        </div>
      </div>
    </div>
  )
}
