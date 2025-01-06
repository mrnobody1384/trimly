"use client";
import {
  TextInput,
  MultiSelect,
  Button,
  Stack,
  Group,
  FileButton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { employeeSchema } from "@/lib/types/employee";
import { useState } from "react";
import { createExpert } from "@/lib/api";
import { Employee } from "@/lib/types/employee";
import { MyTimeField, TimeRangeInput } from "./TimeRangeInput";
import { daysOptions } from "@/lib/types/options";
import { service } from "@/lib/types/service";
import { Time } from "@internationalized/date";
import { TimeValue } from "react-aria";

interface EmployeeFormProps {
  employee?: Employee;
  services?: service[] | null;
  onSubmit: (
    data: {
      error: any;
      code: number;
      success: string | null;
    },
    type: string
  ) => void;
}

export function EmployeeForm({
  employee,
  onSubmit,
  services = [],
}: EmployeeFormProps) {
  const form = useForm({
    initialValues: {
      user_first_name: employee?.user_first_name || "",
      user_last_name: employee?.user_last_name || "",
      user_image_profile: employee?.user_image_profile || "",
      user_phone_number: employee?.user_phone_number || "",
      service_ids: employee?.service_ids || [],
      shifts: {
        start: employee?.shifts.start || new Time(8),
        end: employee?.shifts.end || new Time(21, 45),
        days: employee?.shifts.days || [],
      },
    },
    // validate: zodResolver(employeeSchema),
  });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (values: Employee, event: any) => {
    const start = values.shifts.start?.toString();
    const end = values.shifts.end?.toString();
    const v: any = structuredClone(values);
    v.shifts.start = start;
    v.shifts.end = end;
    v.user_image_profile = file;
    v.shifts.days = v.shifts.days.map((day: string) => parseInt(day));
    console.log(v);
    try {
      const formData = new FormData();
      formData.append("user_first_name", v.user_first_name);
      formData.append("user_last_name", v.user_last_name);
      formData.append("user_image_profile", v.user_image_profile);
      formData.append("user_phone_number", v.user_phone_number);
      formData.append("service_ids", v.service_ids);
      formData.append("shifts", JSON.stringify(v.shifts));
      const res = await createExpert(formData);
      const e = event?.nativeEvent?.submitter.name;
      onSubmit(res, e);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <div className="flex gap-3">
          <TextInput
            label="نام"
            placeholder="نام"
            {...form.getInputProps("user_first_name")}
            className="flex-1"
          />
          <TextInput
            label="نام خانوادگی"
            placeholder="نام خانوادگی"
            {...form.getInputProps("user_last_name")}
            className="flex-1"
          />
        </div>
        <TextInput
          label="شماره تلفن"
          placeholder="تلفن همراه"
          {...form.getInputProps("user_phone_number")}
          className="flex-1"
        />

        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => (
            <Button {...props}>
              {file ? file.name : "بارگزاری تصویر پروفایل"}
            </Button>
          )}
        </FileButton>

        <MultiSelect
          label="تخصص‌ها"
          placeholder="تخصص‌ها را انتخاب کنید"
          data={services?.map((s: service) => {
            // console.log(s);
            return { label: s.name, value: s.id as string };
          })}
          {...form.getInputProps("service_ids")}
        />
        <div className="flex justify-evenly items-center">
          <MyTimeField
            label="زمان شروع"
            value={form.values.shifts.start}
            onChange={(value) => {
              form.setFieldValue("shifts.start", value as TimeValue);
            }}
            hourCycle={24}
          />
          <MyTimeField
            label="زمان شروع"
            value={form.values.shifts.end}
            onChange={(value) => {
              form.setFieldValue("shifts.end", value as TimeValue);
            }}
            hourCycle={24}
          />
        </div>
        <MultiSelect
          label="روزهای کاری"
          placeholder="روزهای کاری را انتخاب کنید"
          data={daysOptions}
          {...form.getInputProps("shifts.days")}
        />

        <Group justify="flex" mt="xl">
          <Button type="submit" color="yellow" className="flex-1" name="ac">
            {employee ? "ویرایش اطلاعات" : "افزودن کارمند و بستن"}
          </Button>
          <Button
            type="button"
            color="yellow"
            className="flex-1"
            name="a"
            onClick={() => form.reset()}
          >
            {employee ? "ویرایش اطلاعات" : "افزودن کارمند"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
