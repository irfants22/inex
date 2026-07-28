import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

interface FormSwitchProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export default function FormSwitch<T extends FieldValues>(
  props: FormSwitchProps<T>,
) {
  const { control, label, name } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => (
        <Field data-invalid={!!error}>
          <div className="flex items-center space-x-2">
            <Switch
              {...field}
              checked={value ?? true}
              onCheckedChange={onChange}
              id={name}
              className="data-checked:bg-emerald-500"
            />
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          </div>

          <FieldError errors={[error]} />
        </Field>
      )}
    />
  );
}
