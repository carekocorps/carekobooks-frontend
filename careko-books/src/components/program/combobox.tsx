"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const genres = [
  { value: "romance", label: "Romance" },
  { value: "ficcao", label: "Ficção" },
  { value: "fantasia", label: "Fantasia" },
  { value: "biografia", label: "Biografia" },
  { value: "leitura-tecnica", label: "Leitura Técnica" },
];

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ComboboxDemo({ value, onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onChange(newValue);
    setOpen(false);
  };

  const selectedLabel = genres.find((g) => g.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-gray-600"
        >
          {selectedLabel || "Selecione um Gênero"}
          <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Procure um gênero..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
            <CommandGroup>
              {genres.map((genre) => (
                <CommandItem
                  key={genre.value}
                  value={genre.value}
                  onSelect={handleSelect}
                >
                  {genre.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === genre.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
