// import { createDiscount } from "@/lib/api";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

interface GiftFormProps {
  onSubmit: (data: {
    error: any;
    code: number;
    success: string | null;
  }) => void;
  close: () => void;
}

function GiftcardForm({ onSubmit }: GiftFormProps) {
  const form = useForm({
    initialValues: {
      code: "",
    },
  });

  async function handleSubmit(values: any) {
    // const res = await createDiscount(values);
    // onSubmit(res);
  }

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="نام"
            placeholder="نام"
            {...form.getInputProps("code")}
            className="flex-1"
          />

          <Group justify="flex" mt="xl">
            <Button type="submit" color="indigo" className="flex-1" name="a">
              افزودن کد تخفیف
            </Button>
            <Button
              type="button"
              color="red"
              className="flex-1"
              onClick={close}
            >
              بستن
            </Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
}

export default GiftcardForm;
