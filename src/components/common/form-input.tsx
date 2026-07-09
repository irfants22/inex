import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export default function FormInput<T extends FieldValues>(
  props: FormInputProps<T>,
) {
  const {
    control,
    name,
    label,
    type = "text",
    placeholder,
    autoComplete = "off",
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {type === "textarea" ? (
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={!!error}
              className="resize-none"
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={!!error}
            />
          )}
          <FieldError errors={[error]} />
        </Field>
      )}
    />
  );
}
