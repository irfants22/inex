"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function TransactionActivityChart({
  transactionByDate,
}: {
  transactionByDate: {
    date: string;
    income: number;
    expense: number;
  }[];
}) {
  const chartConfig = {
    income: {
      label: "Income",
      color: "oklch(68.5% 0.169 237.323)",
    },
    expense: {
      label: "Expense",
      color: "oklch(64.5% 0.246 16.439)",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full rounded-md bg-slate-100/60 p-4">
      <Label>This Month's Activities</Label>
      <ChartContainer config={chartConfig} className="mt-4 max-h-96 w-full">
        <BarChart accessibilityLayer data={transactionByDate}>
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
