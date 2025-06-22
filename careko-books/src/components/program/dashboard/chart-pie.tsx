"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGenreProgresses } from "@/hooks/useGenreProgresses" 

const palette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

interface GenrePieChartProps {
  username: string | null;
}

export function GenrePieChart({ username }: GenrePieChartProps) {
  const { 
    genreProgresses, 
    totalProgresses,
    loading, 
    error 
  } = useGenreProgresses({ username, maxGenres: 5 });

  const chartData = genreProgresses.map((genre, index) => ({
    genreName: genre.genreName,
    count: genre.count,
    fill: palette[index % palette.length]
  }));

  const chartConfig = {
    count: {
      label: "Progressos",
    },
    ...genreProgresses.reduce((config, genre, index) => {
      config[genre.genreName] = {
        label: genre.genreDisplayName,
        color: palette[index % palette.length]
      };
      return config;
    }, {} as Record<string, { label: string; color: string }>)
  } satisfies ChartConfig;

  if (loading) {
    return <div className="flex justify-center p-8">Carregando dados...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-8 text-red-500">Erro: {error}</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Livros por Gênero</CardTitle>
        <CardDescription>Distribuição dos seus progressos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="genreName"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProgresses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Progressos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Seu progresso por gênero <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Top {genreProgresses.length} gêneros mais frequentes
        </div>
      </CardFooter>
    </Card>
  );
}