import { Group } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import type {
  TimeFieldProps,
  TimeValue,
  ValidationResult,
} from "react-aria-components";
import { FieldError, Text } from "react-aria-components";

import {
  DateInput,
  DateSegment,
  Label,
  TimeField,
} from "react-aria-components";
interface MyTimeFieldProps<T extends TimeValue> extends TimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

interface TimeRangeInputProps {
  form: UseFormReturnType<any>;
  startPath: string;
  endPath: string;
}

export function TimeRangeInput({
  form,
  startPath,
  endPath,
}: TimeRangeInputProps) {
  return (
    <Group grow>
      <TimeInput label="ساعت شروع" {...form.getInputProps(startPath)} />
      <TimeInput label="ساعت پایان" {...form.getInputProps(endPath)} />
    </Group>
  );
}

export function MyTimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: MyTimeFieldProps<T>) {
  return (
    <TimeField {...props}>
      <Label>{label}</Label>
      <DateInput className="flex justify-between flex-row-reverse">
        {(segment) => (
          <DateSegment
            segment={segment}
            className={({ isFocused }) =>
              isFocused ? "bg-yellow text-xl" : ""
            }
          />
        )}
      </DateInput>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </TimeField>
  );
}

