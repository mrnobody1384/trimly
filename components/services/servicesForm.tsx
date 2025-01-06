"use client";
import React, { useEffect } from "react";
import {
  TextInput,
  NumberInput,
  Group,
  Button,
  Stack,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { service } from "@/lib/types/service";

interface props {
  onSave(service: service): void;
  onCancel(): void;
}

const ServiceForm = ({onSave, onCancel }: props) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      duration: 15,
    } as service,

    validate: {
      name: (value) => (value ? null : "نام خدمت الزامی است"),
      price: (value) => (value > 0 ? null : "قیمت باید بیشتر از صفر باشد"),
      duration: (value: number) =>
        value >= 15 && value <= 360
          ? null
          : "مدت زمان باید بین 15 دقیقه تا 6 ساعت باشد",
    },
  });



  const handleSubmit = async (values: any) => {
    const hours = Math.floor(values.duration / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (values.duration % 60).toString().padStart(2, "0");
    const formattedDuration = `${hours}:${minutes}`;

    const payload = {
      ...values,
      duration: formattedDuration, // جایگزینی مدت زمان با فرمت مناسب
    };

    try {
      

      // Call the onSave function passed as a prop to update the service list
      onSave(payload);
      form.reset();
    } catch (error) {
      console.error("Error submitting service:", error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="w-3/4 mx-auto">
      <Stack>
        {/* فیلد نام خدمت */}
        <TextInput
          label="نام خدمت"
          placeholder="نام خدمت را وارد کنید"
          {...form.getInputProps("name")}
        />

        {/* فیلد توضیحات */}
        <TextInput
          label="توضیحات"
          placeholder="توضیحات مربوط به خدمت را وارد کنید"
          {...form.getInputProps("description")}
        />

        {/* فیلد قیمت */}
        <NumberInput
          label="قیمت (تومان)"
          placeholder="قیمت خدمت را وارد کنید"
          min={0}
          {...form.getInputProps("price")}
        />

        {/* انتخاب مدت زمان */}
        <Select
          label="مدت زمان (دقیقه)"
          placeholder="مدت زمان را انتخاب کنید"
          data={Array.from({ length: 24 }, (_, i) => 15 * (i + 1))
            .filter((value) => value <= 360)
            .map((value) => ({
              value: value.toString(),
              label: value % 60 === 0 ? `${value / 60} ساعت` : `${value} دقیقه`,
            }))}
          {...form.getInputProps("duration")}
        />

        {/* دکمه ارسال */}
        <Group
          mt="lg"
          classNames={{
            root: "!flex !justify-center",
          }}
        >
          <Button type="submit" color="green">
       افزودن خدمت
          </Button>
          <Button type="button" onClick={onCancel} color="gray">
            انصراف
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ServiceForm;
