import * as React from "react";
type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
    disableTransitionOnChange?: boolean;
};
type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};
export declare function ThemeProvider({ children, defaultTheme, storageKey, disableTransitionOnChange, ...props }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare const useTheme: () => ThemeProviderState;
export {};
