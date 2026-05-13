import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type MapItem = { name: string; src: string; displayName: string }

type Props = {
  initial?: string
  onChange?: (item: MapItem | undefined) => void
  showPreview?: boolean
  label?: string
}

export function KewtiMap({ initial, onChange, showPreview = true, label = 'Select Map' }: Props) {
  const [maps, setMaps] = useState<MapItem[]>([])
  const [selectedName, setSelectedName] = useState<string | undefined>(initial)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load images on mount
  useEffect(() => {
    ;(async () => {
      try {
        // @ts-ignore - import.meta.glob typing
        const imageModules = import.meta.glob('./maps/*.{png,jpg,jpeg,svg,webp}', { eager: true })
        const loadedMaps: MapItem[] = Object.entries(imageModules)
          .map(([path, mod]: [string, any]) => {
            const src = (mod && (mod.default || mod)) || ''
            const name = path.split('/').pop()?.replace(/\.(png|jpe?g|svg|webp)$/i, '') || 'unknown'
            // Rename "map frame" to "none"
            const displayName = name.toLowerCase() === 'map frame' ? 'None' : name
            return { name, src, displayName }
          })
          .sort((a, b) => a.displayName.localeCompare(b.displayName))

        setMaps(loadedMaps)
        if (!initial && loadedMaps.length > 0 && !selectedName) {
          setSelectedName(loadedMaps[0].name)
        }
      } catch (error) {
        console.error('Failed to load maps:', error)
      }
    })()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selected = maps.find((m) => m.name === selectedName) ?? maps[0]

  useEffect(() => {
    onChange?.(selected)
  }, [selected, onChange])

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Label */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        
        {/* Custom Dropdown */}
        <div ref={dropdownRef} className="relative w-full">
          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'h-9 w-full rounded-lg border border-input bg-background px-3 py-2',
              'text-sm text-foreground transition-all outline-none',
              'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
              'hover:border-ring/50 cursor-pointer flex items-center justify-between',
              'disabled:pointer-events-none disabled:opacity-50',
              'dark:bg-input/30 dark:border-input/50 dark:hover:border-input',
              isOpen && 'border-ring ring-2 ring-ring/50'
            )}
          >
            <span className="truncate text-left">{selected?.displayName || 'Select...'}</span>
            <svg
              className={cn(
                'w-4 h-4 transition-transform flex-shrink-0 ml-2',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-input rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {maps.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                    No maps available
                  </div>
                ) : (
                  maps.map((map) => (
                    <button
                      key={map.name}
                      onClick={() => {
                        setSelectedName(map.name)
                        setIsOpen(false)
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm transition-colors outline-none',
                        'hover:bg-muted hover:text-foreground',
                        'focus-visible:bg-muted focus-visible:text-foreground',
                        selected?.name === map.name && 'bg-primary text-primary-foreground hover:bg-primary'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{map.displayName}</span>
                        {selected?.name === map.name && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </label>

      {/* Map Preview */}
      {showPreview && selected && (
        <div className="relative w-full h-80 rounded-lg border border-border overflow-hidden bg-muted/30 flex items-center justify-center group">
          <img
            src={selected.src}
            alt={selected.displayName}
            className="w-full h-full object-contain opacity-95 transition-transform group-hover:scale-[1.02]"
          />
          {/* Label overlay */}
          <div className="absolute left-3 top-3 px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">{selected.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}
