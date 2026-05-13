import React, { useEffect, useState } from 'react'
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

  const selected = maps.find((m) => m.name === selectedName) ?? maps[0]

  useEffect(() => {
    onChange?.(selected)
  }, [selected, onChange])

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Label */}
      <label className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        
        {/* Horizontal Button Selection */}
        <div className="flex flex-wrap gap-2">
          {maps.length === 0 ? (
            <div className="text-sm text-muted-foreground">No maps available</div>
          ) : (
            maps.map((map) => (
              <button
                key={map.name}
                onClick={() => setSelectedName(map.name)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all outline-none',
                  'border border-input hover:border-ring/50',
                  'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
                  'dark:border-input/50 dark:hover:border-input',
                  selected?.name === map.name
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground hover:bg-muted'
                )}
              >
                {map.displayName}
              </button>
            ))
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
