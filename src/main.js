import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(ThemeProvider, { children: _jsx(App, {}) }) }));
