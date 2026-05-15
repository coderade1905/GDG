import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
declare function InputGroup({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-start" | "inline-end" | "block-start" | "block-end" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function InputGroupAddon({ className, align, ...props }: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): import("react/jsx-runtime").JSX.Element;
declare const inputGroupButtonVariants: (props?: ({
    size?: "xs" | "sm" | "icon-xs" | "icon-sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function InputGroupButton({ className, type, variant, size, ...props }: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>): import("react/jsx-runtime").JSX.Element;
declare function InputGroupText({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
declare function InputGroupInput({ className, ...props }: React.ComponentProps<"input">): import("react/jsx-runtime").JSX.Element;
declare function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">): import("react/jsx-runtime").JSX.Element;
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea, };
