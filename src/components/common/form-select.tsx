import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  selectItem: { value: string; label: string; renderItem?: ReactNode }[];
}

export default function FormSelect<T extends FieldValues>(
  props: FormSelectProps<T>,
) {
  const { control, label, name, selectItem } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => {
        const selectedLabel = selectItem.find((item) => item.value === value);

        return (
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select {...field} value={value} onValueChange={onChange}>
              <SelectTrigger
                className={cn("w-full", {
                  "border-destructive focus:ring-destructive": !!error,
                })}
              >
                <SelectValue
                  placeholder={`Select ${label}`}
                  className="capitalize"
                >
                  {selectedLabel && (
                    <>
                      {selectedLabel.renderItem && selectedLabel.renderItem}
                      {selectedLabel.label}
                    </>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {selectItem.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="capitalize"
                    >
                      {item.renderItem && item.renderItem}
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[error]} />
          </Field>
        );
      }}
    />
  );
}
