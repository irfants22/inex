import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format, parse } from "date-fns";

interface FormDateProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export default function FormDate<T extends FieldValues>(
  props: FormDateProps<T>,
) {
  const { name, control, label } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Popover>
            <PopoverTrigger
              aria-invalid={!!error}
              render={
                <Button
                  variant="outline"
                  data-empty={!value}
                  className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                />
              }
            >
              <CalendarIcon />
              {value ? (
                format(parse(value, "yyyy-MM-dd", new Date()), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                {...field}
                mode="single"
                selected={
                  value ? parse(value, "yyyy-MM-dd", new Date()) : undefined
                }
                onSelect={(date) =>
                  onChange(date ? format(date, "yyyy-MM-dd") : "")
                }
              />
            </PopoverContent>
          </Popover>
          <FieldError errors={[error]} />
        </Field>
      )}
    />
  );
}
