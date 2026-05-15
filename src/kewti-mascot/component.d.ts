import * as React from "react";
interface KewtiPasswordProps {
    /** Placeholder text */
    placeholder?: string;
    /** Show the strength meter & rule checklist */
    showStrength?: boolean;
    /** External change handler */
    onChange?: (value: string) => void;
    /** Controlled value */
    value?: string;
    /** Label text above the input */
    label?: string;
    /** Extra wrapper classes */
    className?: string;
    /** Slot for a mascot or illustration above the input */
    mascot?: React.ReactNode;
    setUserPassword?: React.Dispatch<React.SetStateAction<string>>;
    style?: React.CSSProperties;
}
export declare function KewtiPassword({ placeholder, showStrength, onChange, value: controlledValue, label, className, mascot, setUserPassword, style }: KewtiPasswordProps): import("react/jsx-runtime").JSX.Element;
export {};
