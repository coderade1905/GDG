import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";
import Papa from "papaparse";
export function KewtiLocationSelector({ setAddress }) {
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState({ region: false, zone: false, woreda: false });
    const [values, setValues] = React.useState({ region: "", zone: "", woreda: "" });
    useEffect(() => {
        fetch("/data.csv")
            .then((response) => response.text())
            .then((csvText) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setData(results.data);
                },
            });
        });
    }, []);
    useEffect(() => {
        if (setAddress) {
            const address = [values.region, values.zone, values.woreda].filter(Boolean);
            setAddress(address);
        }
    }, [values, setAddress]);
    const regions = Array.from(new Set(data.map((i) => i.admin1_name))).sort();
    const zones = Array.from(new Set(data.filter((i) => i.admin1_name === values.region).map((i) => i.admin2_name))).sort();
    const woredas = Array.from(new Set(data.filter((i) => i.admin1_name === values.region && i.admin2_name === values.zone).map((i) => i.admin3name))).sort();
    return (_jsxs("div", { className: "flex gap-4 p-6", children: [_jsx(Combobox, { open: open.region, setOpen: (val) => setOpen({ ...open, region: val }), value: values.region, setValue: (val) => setValues({ region: val, zone: "", woreda: "" }), options: regions, placeholder: "Select Region..." }), _jsx(Combobox, { open: open.zone, setOpen: (val) => setOpen({ ...open, zone: val }), value: values.zone, setValue: (val) => setValues({ ...values, zone: val, woreda: "" }), options: zones, placeholder: "Select Zone...", disabled: !values.region }), _jsx(Combobox, { open: open.woreda, setOpen: (val) => setOpen({ ...open, woreda: val }), value: values.woreda, setValue: (val) => setValues({ ...values, woreda: val }), options: woredas, placeholder: "Select Woreda...", disabled: !values.zone })] }));
}
function Combobox({ open, setOpen, value, setValue, options, placeholder, disabled }) {
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", className: "w-[250px] justify-between", disabled: disabled, children: [value || placeholder, _jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })] }) }), _jsx(PopoverContent, { className: "w-[250px] p-0", children: _jsxs(Command, { children: [_jsx(CommandInput, { placeholder: `Search...` }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: "No results found." }), _jsx(CommandGroup, { children: options.map((opt) => (_jsxs(CommandItem, { value: opt, onSelect: () => {
                                            setValue(opt);
                                            setOpen(false);
                                        }, children: [_jsx(Check, { className: cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0") }), opt] }, opt))) })] })] }) })] }));
}
