"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MONTH_SELECT_ITEMS,
  TRANSACTION_TYPES_SELECT_ITEMS,
} from "@/constants/transaction";

export function TransactionFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const now = new Date();
  const currentYearNow = now.getFullYear();

  const currentMonth = Number(searchParams.get("month")) || now.getMonth() + 1;
  const currentYear = Number(searchParams.get("year")) || currentYearNow;
  const currentType = searchParams.get("type") || "all";

  const years = Array.from({ length: 10 }, (_, i) => currentYearNow - i);

  const selectedMonthLabel = MONTH_SELECT_ITEMS.find(
    (m) => m.value === String(currentMonth),
  )?.label;

  const selectedTypeLabel = TRANSACTION_TYPES_SELECT_ITEMS.find(
    (t) => t.value === currentType,
  )?.label;

  function updateFilter(month: number, year: number, type: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(month));
    params.set("year", String(year));
    params.set("type", type);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="w-full rounded-lg bg-white p-4">
      <FieldSet>
        <FieldGroup className="grid w-full grid-cols-3 gap-2">
          {/* month */}
          <Field>
            <FieldLabel htmlFor="month">Month</FieldLabel>
            <Select
              value={String(currentMonth)}
              onValueChange={(month) =>
                updateFilter(Number(month), currentYear, currentType)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month">
                  {selectedMonthLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Month</SelectLabel>
                  {MONTH_SELECT_ITEMS.map((m) => (
                    <SelectItem
                      key={m.label}
                      value={m.value}
                      className="capitalize"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {/* year */}
          <Field>
            <FieldLabel htmlFor="year">Year</FieldLabel>
            <Select
              value={String(currentYear)}
              onValueChange={(year) =>
                updateFilter(currentMonth, Number(year), currentType)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {years.map((y) => (
                    <SelectItem key={y} value={y} className="capitalize">
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {/* type */}
          <Field>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <Select
              value={String(currentType)}
              onValueChange={(type) =>
                updateFilter(currentMonth, currentYear, String(type))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type">
                  {selectedTypeLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {TRANSACTION_TYPES_SELECT_ITEMS.map((t) => (
                    <SelectItem
                      key={t.label}
                      value={t.value}
                      className="capitalize"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
