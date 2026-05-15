type MapItem = {
    name: string;
    src: string;
    displayName: string;
};
type Props = {
    initial?: string;
    onChange?: (item: MapItem | undefined) => void;
    onRegionSelect?: (info: {
        map: string;
        regionIndex: number;
    }) => void;
    showPreview?: boolean;
    label?: string;
};
export declare function KewtiMap({ onRegionSelect, label }: Props): import("react/jsx-runtime").JSX.Element;
export {};
