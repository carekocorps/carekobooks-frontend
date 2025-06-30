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
import { GenreService } from "@/services/genre.service";

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ComboboxDemo({ value, onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [genres, setGenres] = React.useState<{ value: string; label: string }[]>([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    GenreService.getGenres(1, 100, "", "name", true)
      .then(res => {
        const opts = res.data.content.map((g: { name: string; displayName: string }) => ({
          value: g.name,
          label: g.displayName || g.name,
        }));
        setGenres(opts);
      })
      .catch(err => console.error("Erro ao buscar gêneros:", err));
  }, []);

  const handleSelect = (val: string) => {
    onChange(val === value ? "" : val);
    setOpen(false);
  };

  const filtered = filter
    ? genres.filter(g => g.label.toLowerCase().includes(filter.toLowerCase()))
    : genres;

  const selectedLabel = genres.find(g => g.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-gray-600"
        >
          {selectedLabel || "Selecione um gênero"}
          <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Procure um gênero..."
            className="h-9"
            value={filter}
            onValueChange={setFilter}
          />
          <CommandList>
            <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
            <CommandGroup>
              {filtered.map(genre => (
                <CommandItem
                  key={genre.value}
                  value={genre.value}
                  onSelect={() => handleSelect(genre.value)}
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
