"use client";
import { UpgradeToSalon } from "@/lib/api";
import { UserType } from "@/lib/types/user";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { CircleCheckBig, User, UserRoundPen, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "react-aria-components";

export default function UserHeader({ user }: { user: UserType }) {
  const router = useRouter();
  const [token, setToken, removeToken] = useLocalStorage({
    key: "token",
    defaultValue: "",
  });
  const [role, setRole, removeRole] = useLocalStorage({
    key: "role",
    defaultValue: "",
  });
  async function handleToSalon() {
    const res = await UpgradeToSalon();
    if (res.success) {
      notifications.show({
        message: res.success,
        title: "موفق",
        position: "top-center",
        color: "green",
        icon: <CircleCheckBig />,
        autoClose: 2000,
        onClose(props) {
          removeToken();
          removeRole();
          router.push("/auth");
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
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div
        id="imgContainer"
        className="rounded-full w-20 h-20 p-2 border border-gray-400 relative"
      >
        {user.image_profile ? (
          <Image
            src={"http://127.0.0.1:8000" + user.image_profile}
            alt="image"
            layout="fill"
            className="rounded-full object-cover"
          />
        ) : (
          <User className="w-full h-full" />
        )}
      </div>
      <h2>{user.first_name + " " + user.last_name}</h2>
      <h3>{user.phone_number}</h3>
      <Button
        onPress={handleToSalon}
        className="!bg-teal-300 text-black p-2 px-5 flex gap-2 rounded-lg"
      >
        من صاحب سالن هستم!
        <UserRoundPen />
      </Button>
    </div>
  );
}
