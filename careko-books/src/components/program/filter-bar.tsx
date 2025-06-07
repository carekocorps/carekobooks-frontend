"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ComboboxDemo } from "./combobox";

interface BookFilters {
  authorName?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  pageCountGreater?: number;
  pageCountLower?: number;
  genre?: string;
}

interface UserFilters {
  username?: string;
}

type FilterBarProps = {
  resourceType: "books" | "users";
  filters: BookFilters | UserFilters;
  setFilters: (filters: BookFilters | UserFilters) => void;
};

export default function FilterBar({ resourceType, filters, setFilters }: FilterBarProps) {
  const [authorName, setAuthorName] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [pageRange, setPageRange] = useState("default");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    if (resourceType === "books") {
      const bookFilters = filters as BookFilters;
      setAuthorName(bookFilters.authorName || "");
      setPublishedDate(
        bookFilters.publishedAfter
          ? bookFilters.publishedAfter.slice(0, 4)
          : ""
      );
      if (
        bookFilters.pageCountGreater &&
        bookFilters.pageCountLower &&
        typeof bookFilters.pageCountGreater === "number"
      ) {
        setPageRange(String(bookFilters.pageCountGreater));
      } else {
        setPageRange("default");
      }
      setGenre(bookFilters.genre || "");
    }
  }, [filters, resourceType]);

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleApplyFilters = () => {
    if (resourceType === "books") {
      const newFilters: BookFilters = {};

      if (authorName) newFilters.authorName = authorName;
      if (publishedDate) {
        newFilters.publishedAfter = `${publishedDate}-01-01`;
        newFilters.publishedBefore = `${publishedDate}-12-31`;
      }
      if (pageRange !== "default") {
        const lower = parseInt(pageRange);
        newFilters.pageCountGreater = lower;
        newFilters.pageCountLower = lower + 100;
      }
      if (genre) newFilters.genre = genre;

      setFilters(newFilters);
    } else {
      setFilters({});
    }
  };

  return (
    <div className="bg-muted rounded-2xl shadow-md p-6 flex flex-col gap-6 w-full">
      <header>
        <h2 className="text-lg font-semibold text-center text-foreground">
          Filtro de Busca Avançada
        </h2>
        <Separator className="my-4 bg-border" />
      </header>

      {resourceType === "users" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="displayname" className="text-sm font-medium">
            Nome de Usuário
          </Label>
          <Input
            id="displayname"
            placeholder="ex: fulano123"
            className="bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Autor
            </Label>
            <Input
              id="author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Franz Kafka..."
              className="bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="publishedDate" className="text-sm font-medium">
              Ano de Publicação
            </Label>
            <Input
              id="publishedDate"
              type="number"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              placeholder="1987"
              className="bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Total de Páginas</Label>
            <RadioGroup
              value={pageRange}
              onValueChange={setPageRange}
              className="space-y-2 pl-1"
            >
              {[
                { value: "default", label: "Menor que 100" },
                { value: "100", label: "Entre 100 e 200" },
                { value: "200", label: "Entre 200 e 300" },
                { value: "300", label: "Entre 300 e 400" },
                { value: "400", label: "Entre 400 e 500" },
                { value: "500", label: "Maior que 500" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`radio-${value}`} />
                  <Label htmlFor={`radio-${value}`} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Gênero</Label>
            <ComboboxDemo value={genre} onChange={setGenre} />
          </div>
        </>
      )}

      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar Filtros
        </Button>
        <Button onClick={handleApplyFilters}>Aplicar</Button>
      </div>
    </div>
  );
}