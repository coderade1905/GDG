import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";
import Papa from "papaparse";

interface Row {
  admin1_name: string;
  admin2_name: string;
  admin3name: string;
}

export function KewtiLocationSelector() {
  const [data, setData] = React.useState<Row[]>([]);
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
            setData(results.data as Row[]);
          },
        });
      });
  }, []);

  const regions = Array.from(new Set(data.map((i) => i.admin1_name))).sort();
  const zones = Array.from(new Set(data.filter((i) => i.admin1_name === values.region).map((i) => i.admin2_name))).sort();
  const woredas = Array.from(new Set(data.filter((i) => i.admin1_name === values.region && i.admin2_name === values.zone).map((i) => i.admin3name))).sort();

  return (
    <div className="flex gap-4 p-6">
      <Combobox
        open={open.region}
        setOpen={(val: any) => setOpen({ ...open, region: val })}
        value={values.region}
        setValue={(val: any) => setValues({ region: val, zone: "", woreda: "" })}
        options={regions}
        placeholder="Select Region..."
      />

      <Combobox
        open={open.zone}
        setOpen={(val: any) => setOpen({ ...open, zone: val })}
        value={values.zone}
        setValue={(val: any) => setValues({ ...values, zone: val, woreda: "" })}
        options={zones}
        placeholder="Select Zone..."
        disabled={!values.region}
      />

      <Combobox
        open={open.woreda}
        setOpen={(val: any) => setOpen({ ...open, woreda: val })}
        value={values.woreda}
        setValue={(val: any) => setValues({ ...values, woreda: val })}
        options={woredas}
        placeholder="Select Woreda..."
        disabled={!values.zone}
      />
    </div>
  );
}

function Combobox({ open, setOpen, value, setValue, options, placeholder, disabled }: any) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className="w-[250px] justify-between" 
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder={`Search...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt: string) => (
                <CommandItem 
                  key={opt} 
                  value={opt} 
                  onSelect={() => { 
                    setValue(opt); 
                    setOpen(false); 
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0")} />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}