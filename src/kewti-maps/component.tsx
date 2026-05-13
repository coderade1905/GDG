import { useEffect, useRef, useState } from 'react'
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

// Add styles for SVG animations
const svgStyles = `
  [data-region-index] {
    transition: opacity 0.3s ease, transform 0.3s ease, stroke 0.3s ease;
    transform-origin: center;
  }
  [data-kewti-selected] {
    animation: zoomIn 0.4s ease-out forwards;
  }
  @keyframes zoomIn {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.04);
    }
  }
  [data-region-index]:hover:not([data-kewti-selected]) {
    opacity: 0.8 !important;
    transform: scale(1.01);
  }
`

const regionDefinitions: Array<{ svgIndex: number; name: string }> = [
  { svgIndex: 1, name: 'OROMIA' },
  { svgIndex: 2, name: 'SOMALIA' },
  { svgIndex: 3, name: 'AMHARA' },
  { svgIndex: 4, name: 'SNNPE' },
  { svgIndex: 5, name: 'AFAR' },
  { svgIndex: 6, name: 'TIGRAY' },
  { svgIndex: 7, name: 'BENSHANGUL' },
  { svgIndex: 8, name: 'GAMBELA' },
  { svgIndex: 14, name: 'ADDIS ABEBA' },
] 

const regionDefinitionMap = new Map(regionDefinitions.map((region) => [region.svgIndex, region.name]))

const getRegionName = (index: number) => regionDefinitionMap.get(index) ?? ''

export function KewtiMap({ onRegionSelect, label = 'Select Map' }: Props) {
  const svgContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    // Inline the raw SVG markup
    container.innerHTML = mapRaw || ''

    // Add styles to SVG
    const svg = container.querySelector('svg') as SVGElement | null
    if (svg) {
      svg.style.width = '100%'
      svg.style.height = '100%'
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      
      // Inject styles into SVG
      let style = svg.querySelector('style') as HTMLStyleElement | null
      if (!style) {
        style = document.createElement('style')
        svg.prepend(style)
      }
      style.textContent = svgStyles
    }

    const regionSelector = 'path, rect, polygon, circle, g'
    const regions = Array.from(container.querySelectorAll(regionSelector)) as Element[]

    const cleanup: Array<{ el: Element; click: EventListenerOrEventListenerObject; keydown: EventListenerOrEventListenerObject; mouseover: EventListenerOrEventListenerObject; mouseout: EventListenerOrEventListenerObject; prevStroke?: string | null; prevStrokeWidth?: string | null; prevOpacity?: string | null }> = []
    const interactiveRegionIndices = new Set<number>(regionDefinitions.map((region) => region.svgIndex))

    const mapName = 'map'

    regions.forEach((el, svgIndex) => {
      const isInteractive = interactiveRegionIndices.has(svgIndex)

      if (!isInteractive) {
        ;(el as HTMLElement).style.pointerEvents = 'none'
        return
      }

      el.setAttribute('data-region-index', String(svgIndex))
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')
      ;(el as HTMLElement).style.cursor = 'pointer'

      const prevStroke = el.getAttribute('stroke')
      const prevStrokeWidth = el.getAttribute('stroke-width')
      const prevOpacity = el.getAttribute('opacity')

      const handleClick = (e: Event) => {
        e.stopPropagation()

        // Clear previous highlight and reset all regions
        cleanup.forEach((r) => {
          if (r.prevStroke != null) r.el.setAttribute('stroke', r.prevStroke)
          else r.el.removeAttribute('stroke')
          if (r.prevStrokeWidth != null) r.el.setAttribute('stroke-width', r.prevStrokeWidth)
          else r.el.removeAttribute('stroke-width')
          if (r.prevOpacity != null) r.el.setAttribute('opacity', r.prevOpacity)
          else r.el.setAttribute('opacity', '1')
          r.el.removeAttribute('data-kewti-selected')
          // Reset transform
          ;(r.el as SVGElement).style.transform = 'scale(1)'
        })

        // Apply highlight to the clicked element
        el.setAttribute('data-kewti-selected', 'true')
        el.setAttribute('stroke', '#111111')
        el.setAttribute('stroke-width', '6')
        el.setAttribute('opacity', '1')

        // Dim all other regions with smooth transition
        cleanup.forEach((r) => {
          if (r.el !== el) {
            r.el.setAttribute('opacity', '0.3')
          }
        })

        setSelectedRegion(svgIndex)
        onRegionSelect?.({ map: mapName, regionIndex: svgIndex })
      }

      const handleKey: EventListener = (ev) => {
        const keyboardEvent = ev as KeyboardEvent
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault()
          handleClick(keyboardEvent)
        }
      }

      const handleMouseOver = (event: Event) => {
        const target = event.currentTarget as Element
        const regionIndex = target.getAttribute('data-region-index')
        if (regionIndex !== null) {
          setHoveredRegion(parseInt(regionIndex, 10))
        }
      }

      const handleMouseOut = () => {
        setHoveredRegion(null)
      }

      el.addEventListener('click', handleClick)
      el.addEventListener('keydown', handleKey as EventListener)
      el.addEventListener('mouseenter', handleMouseOver)
      el.addEventListener('mouseleave', handleMouseOut)

      cleanup.push({ el, click: handleClick, keydown: handleKey, mouseover: handleMouseOver, mouseout: handleMouseOut, prevStroke, prevStrokeWidth, prevOpacity })
    })

    // Add mousemove listener to track cursor position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      })
    }

    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      cleanup.forEach((r) => {
        r.el.removeEventListener('click', r.click)
        r.el.removeEventListener('keydown', r.keydown as EventListener)
        r.el.removeEventListener('mouseenter', r.mouseover)
        r.el.removeEventListener('mouseleave', r.mouseout)
        if (r.el.getAttribute('data-kewti-selected') === 'true') {
          if (r.prevStroke != null) r.el.setAttribute('stroke', r.prevStroke)
          else r.el.removeAttribute('stroke')
          if (r.prevStrokeWidth != null) r.el.setAttribute('stroke-width', r.prevStrokeWidth)
          else r.el.removeAttribute('stroke-width')
          if (r.prevOpacity != null) r.el.setAttribute('opacity', r.prevOpacity)
          else r.el.setAttribute('opacity', '1')
          r.el.removeAttribute('data-kewti-selected')
        }
      })
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {selectedRegion !== null && (
          <div className="px-3 py-2 rounded-md bg-black text-white border border-white/15 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-semibold tracking-wide uppercase text-white">
              {getRegionName(selectedRegion)}
            </span>
          </div>
        )}
      </label>

      <div className="relative w-full max-w-[30vw] overflow-hidden flex items-center justify-center">
        <div ref={svgContainerRef} className="w-full h-full" />

        <div className={cn(
          "absolute left-3 top-3 px-2.5 py-1.5 rounded-md bg-black text-white border border-white/10 backdrop-blur-sm transition-all duration-300",
          selectedRegion !== null || hoveredRegion !== null ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <span className="text-xs font-medium uppercase tracking-wider text-white">SVG Map</span>
        </div>

        {hoveredRegion !== null && (
          <div
            className="fixed px-3 py-1.5 rounded-md bg-black text-white text-xs font-semibold uppercase tracking-wide pointer-events-none shadow-lg border border-white/15 z-50"
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y + 20}px`,
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            {getRegionName(hoveredRegion)}
          </div>
        )}
      </div>
    </div>
  )
}
