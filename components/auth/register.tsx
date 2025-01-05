"use client";

import { useDisclosure } from "@mantine/hooks";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import {
  KeyIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  XCircleIcon,
  CircleCheckBig,
} from "lucide-react";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

// Define Zod schema
const schema = z.object({
  first_name: z.string().min(2, "نام باید حداقل ۲ حرف باشد."),
  last_name: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد."),
  phone_number: z.string().min(11).max(11),
  email: z.string().email().min(4, "ایمیل باید حداقل 4 کارکتر باشد"),
});

function Register() {
  const router = useRouter();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
    },
  });

  const handleSubmit = async (values: any) => {
    console.log("Form submitted:", values);
    // Add your registration logic here
    let res = await register(values);
    if (res.success) {
      notifications.show({
        message: "کد با موفقیت ارسال شد.",
        title: "موفق",
        position: "top-center",
        color: "green",
        icon: <CircleCheckBig />,
        autoClose: 2000,
        onClose(props) {
          router.push(`/auth/verify`);
        },
      });
    } else {
      notifications.show({
        message: res.error,
        title: "خطا",
        position: "top-center",
        color: "red",
        icon: <XCircleIcon />,
      });
      console.log(res.error);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="flex flex-col justify-center items-center w-full gap-5"
    >
      <TextInput
        type="text"
        placeholder="لطفا نام خود را وارد کنید."
        className="w-full"
        leftSection={<UserIcon />}
        label="نام"
        {...form.getInputProps("first_name")}
        error={form.errors.first_name}
      />
      <TextInput
        type="text"
        placeholder="لطفا نام خانوادگی خود را وارد کنید."
        className="w-full"
        leftSection={<UserIcon />}
        label="نام خانوادگی"
        {...form.getInputProps("last_name")}
        error={form.errors.last_name}
      />
      <TextInput
        type="text"
        placeholder="لطفا شماره تلفن خود را وارد کنید."
        className="w-full"
        leftSection={<PhoneIcon />}
        label="تلفن همراه"
        {...form.getInputProps("phone_number")}
        error={form.errors.phone_number}
      />

      <TextInput
        type="text"
        placeholder="لطفا ایمیل خود را وارد کنید"
        className="w-full"
        leftSection={<MailIcon />}
        label="ایمیل"
        {...form.getInputProps("email")}
        error={form.errors.email}
      />

      <Button type="submit" className="!w-full !font-bold">
        ثبت نام
      </Button>
    </form>
  );
}

export default Register;
