import { Button, Input, TextInput } from "@mantine/core";
import {
  UserIcon,
  KeyIcon,
  PhoneIcon,
  CircleCheckBig,
  XCircleIcon,
} from "lucide-react";
import { useForm, zodResolver } from "@mantine/form";
import * as z from "zod";
import { login } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
function Login() {
  const router = useRouter();

  const schema = z.object({
    phone_number: z
      .string()
      .regex(/^09\d{9}$/, "شماره تلفن باید معتبر باشد و با 09 شروع شود."),
  });
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      phone_number: "",
    },
  });

  async function handleSubmit(values: any) {
    let res = await login(values);
    if (res.success) {
      notifications.show({
        message: res.success,
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
  }

  return (
    <div className="w-full gap-5 flex justify-center flex-col">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="تلفن همراه"
          leftSection={<PhoneIcon />}
          {...form.getInputProps("phone_number")}
        />
        <Button className="!w-full !font-bold bg-myellow" type="submit">
          ورود
        </Button>
      </form>
    </div>
  );
}

export default Login;
