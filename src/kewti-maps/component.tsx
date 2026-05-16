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

type MapSection = {
  id: string
  name: string
  svgIndex: number
}

type RegionNode = {
  section: MapSection
  element: SVGElement
}

// Import the SVG as raw text (Vite `?raw`). If TypeScript complains, the tsconfig
// may need a `declare module '*.svg?raw'` entry; ignore TS here for simplicity.
// @ts-ignore
import mapRaw from './maps/map.svg?raw'

const sections: MapSection[] = [
  { id: 'oromia', name: 'OROMIA', svgIndex: 1 },
  { id: 'somalia', name: 'SOMALIA', svgIndex: 2 },
  { id: 'amhara', name: 'AMHARA', svgIndex: 3 },
  { id: 'south', name: 'SNNPE', svgIndex: 4 },
  { id: 'afar', name: 'AFAR', svgIndex: 5 },
  { id: 'tigray', name: 'TIGRAY', svgIndex: 6 },
  { id: 'benshangul', name: 'BENSHANGUL', svgIndex: 7 },
  { id: 'gambela', name: 'GAMBELA', svgIndex: 8 },
  { id: 'addis', name: 'ADDIS ABEBA', svgIndex: 14 },
]

const sectionById = new Map(sections.map((section) => [section.id, section]))

const svgStyleText = `
  svg path,
  svg rect,
  svg polygon,
  svg circle {
    fill: #2b2b2b !important;
    opacity: 1;
    transition: opacity 180ms ease, transform 180ms ease, stroke 180ms ease, stroke-width 180ms ease;
    transform-origin: center;
  }
  [data-kewti-map-section] {
    cursor: pointer;
  }
  [data-kewti-map-section][data-kewti-selected="true"] {
    fill: #f3f3f3 !important;
    stroke: #111111;
    stroke-width: 6;
    opacity: 1;
  }
  [data-kewti-map-section][data-kewti-hovered="true"]:not([data-kewti-selected="true"]) {
    fill: #5a5a5a !important;
    opacity: 0.88;
    stroke: #3b82f6;
    stroke-width: 3;
  }
`

export function KewtiMap({ onRegionSelect, label = 'Select Map' }: Props) {
  const svgContainerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const regionNodesRef = useRef<RegionNode[]>([])
  const onRegionSelectRef = useRef<Props['onRegionSelect']>(onRegionSelect)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const selectedSection = selectedSectionId ? sectionById.get(selectedSectionId) : undefined
  const hoveredSection = hoveredSectionId ? sectionById.get(hoveredSectionId) : undefined

  useEffect(() => {
    onRegionSelectRef.current = onRegionSelect
  }, [onRegionSelect])

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    container.innerHTML = mapRaw || ''

    const svg = container.querySelector('svg') as SVGSVGElement | null
    if (!svg) return

    svgRef.current = svg

    svg.style.width = '100%'
    svg.style.height = '100%'
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    let style = svg.querySelector('style') as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      svg.prepend(style)
    }
    style.textContent = svgStyleText

    const regionElements = Array.from(svg.querySelectorAll('path, rect, polygon, circle, g')) as SVGElement[]
    const cleanup: Array<() => void> = []

    const resolvedNodes = sections
      .map((section) => {
        const element = regionElements[section.svgIndex]
        return element ? ({ section, element } as RegionNode) : null
      })
      .filter((node): node is RegionNode => node !== null)

    regionNodesRef.current = resolvedNodes

    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY })
    }

    svg.addEventListener('mousemove', handleMouseMove)

    resolvedNodes.forEach(({ section, element }) => {
      element.setAttribute('data-kewti-map-section', section.id)
      element.setAttribute('data-kewti-map-index', String(section.svgIndex))
      element.setAttribute('data-kewti-map-name', section.name)
      element.setAttribute('fill', '#2b2b2b')
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.setAttribute('aria-label', section.name)
      element.setAttribute('pointer-events', 'auto')

      const handleClick: EventListener = (event) => {
        event.stopPropagation()
        setSelectedSectionId(section.id)
        onRegionSelectRef.current?.({ map: 'map', regionIndex: section.svgIndex })
      }

      const handleKeyDown: EventListener = (event) => {
        const keyboardEvent = event as KeyboardEvent
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault()
          handleClick(keyboardEvent)
        }
      }

      const handleMouseEnter = () => {
        setHoveredSectionId(section.id)
      }

      const handleMouseLeave = () => {
        setHoveredSectionId((current) => (current === section.id ? null : current))
      }

      element.addEventListener('click', handleClick)
      element.addEventListener('keydown', handleKeyDown)
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)

      cleanup.push(() => {
        element.removeEventListener('click', handleClick)
        element.removeEventListener('keydown', handleKeyDown)
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
    })

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove)
      svgRef.current = null
      cleanup.forEach((dispose) => dispose())
      regionNodesRef.current = []
    }
  }, [])

  useEffect(() => {
    regionNodesRef.current.forEach(({ section, element }) => {
      const isSelected = section.id === selectedSectionId
      const isHovered = section.id === hoveredSectionId

      element.setAttribute('data-kewti-selected', isSelected ? 'true' : 'false')
      element.setAttribute('data-kewti-hovered', isHovered ? 'true' : 'false')

      if (selectedSectionId && !isSelected) {
        element.setAttribute('opacity', '0.28')
        element.setAttribute('fill', '#2b2b2b')
      } else {
        element.setAttribute('opacity', '1')
      }

      // Apply transform scale for hover/selected "pop out" effect
      try {
        const elStyle = (element as unknown as { style: any }).style
        elStyle.transformBox = 'fill-box'
        elStyle.transformOrigin = 'center'
        if (isSelected) {
          elStyle.transform = 'scale(1.05)'
          // bring selected element to the front
          if (svgRef.current) svgRef.current.appendChild(element)
        } else if (isHovered) {
          elStyle.transform = 'scale(1.02)'
        } else {
          elStyle.transform = 'scale(1)'
        }
      } catch (e) {
        // ignore transform assignment errors on some SVG nodes
      }

      if (isSelected) {
        element.setAttribute('fill', '#f3f3f3')
        element.setAttribute('stroke', '#111111')
        element.setAttribute('stroke-width', '6')
      } else if (isHovered) {
        element.setAttribute('fill', '#5a5a5a')
        element.setAttribute('stroke', '#3b82f6')
        element.setAttribute('stroke-width', '3')
      } else {
        element.removeAttribute('stroke')
        element.removeAttribute('stroke-width')
      }
    })
  }, [hoveredSectionId, selectedSectionId])

  return (
    <div className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {selectedSection ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-md border border-white/15 bg-black px-3 py-2 text-white shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-white">
              {selectedSection.name}
            </span>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
            Click a section on the map to select it.
          </div>
        )}
      </label>

      <div className="relative flex h-[clamp(420px,70vh,760px)] w-full items-center justify-center overflow-hidden">
        <div ref={svgContainerRef} className="absolute inset-0 h-full w-full" />

        <div
          className={cn(
            'absolute left-3 top-3 rounded-md border border-white/10 bg-black px-2.5 py-1.5 text-white backdrop-blur-sm transition-all duration-300',
            selectedSection || hoveredSection ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          <span className="text-xs font-medium uppercase tracking-wider text-white">SVG Map</span>
        </div>

        {hoveredSection && hoveredSectionId !== selectedSectionId && (
          <div
            className="pointer-events-none fixed z-50 rounded-md border border-white/15 bg-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg"
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y + 20}px`,
            }}
          >
            {hoveredSection.name}
          </div>
        )}
      </div>
    </div>
  )
}
