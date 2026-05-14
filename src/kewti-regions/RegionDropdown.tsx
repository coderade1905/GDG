import { useState } from 'react'

interface Region {
    id: string
    name: string
    nameAmharic: string
    capital: string
    population: number
    description: string
}

interface RegionsDropdownProps {
    onSelect?: (region: Region) => void
}

export function RegionDropdown ({ onSelect }: RegionsDropdownProps) {
    return (
        <div>Regions Dropdown</div>
    )
}