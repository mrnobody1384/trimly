"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import { verifyOtp } from "@/lib/api";
import { PinInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CircleCheckBig, XCircleIcon } from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";
// Define Zod schema
const schema = z.object({
  otp: z.string().length(6, "کد باید ۶ رقم باشد."),
});

function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone_number = searchParams.get("phone_number");

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      otp: "",
    },
  });
  const [token, setToken] = useLocalStorage({
    key: "token",
    defaultValue: "",
  });
  const [role, setRole] = useLocalStorage({
    key: "role",
    defaultValue: "",
  });

  const handleSubmit = async (values: any) => {
    try {
      console.log("Verifying OTP:", values);
      const response = await verifyOtp(values.otp);
      if (response.success) {
        // Navigate to success page or dashboard
        notifications.show({
          message: response.success,
          title: "خوش آمدید",
          position: "top-center",
          color: "green",
          icon: <CircleCheckBig />,
          autoClose: 2000,
          onClose(props) {
            setToken(response.data.access_token);
            setRole(response.data.user_type);
            window.location.href = "/";
          },
        });
      } else {
        notifications.show({
          message: response.error,
          title: "خطا",
          position: "top-center",
          color: "red",
          icon: <XCircleIcon />,
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      notifications.show({
        message: "OTP verification failed:" + error,
        title: "خطا",
        position: "top-center",
        color: "red",
        icon: <XCircleIcon />,
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="flex flex-col justify-center items-center w-full gap-5 min-h-[95vh]"
    >
      <div className="flex flex-col justify-center items-center w-full gap-5">
        <PinInput
          oneTimeCode
          type={/^[0-9]*$/}
          inputMode="numeric"
          length={6}
          {...form.getInputProps("otp")}
          autoFocus={true}
        />

        <Button type="submit" className="!w-full !font-bold">
          تایید کد
        </Button>
      </div>
    </form>
  );
}

export default VerifyOTP;
