"use client";
import React, { useEffect, useState, useTransition } from "react";
import useUserRole from "@/lib/hooks/useUserRole";
import UserProfile from "@/components/profile/userProfile";
import SalonHeader from "@/components/profile/salonProfile";
import Link from "next/link";
import { SalonProfile, SalonProfile as Sf } from "@/lib/types/employee";
import UserHeader from "@/components/profile/userProfile";
import { Button } from "@mantine/core";
import {
  ArrowRight,
  CalendarSearchIcon,
  ChevronLeft,
  GiftIcon,
  LogOut,
  PersonStanding,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/api";
import { UserType } from "@/lib/types/user";
import LoadingSpinner from "@/components/loader";
import { useLoading } from "@/components/LoadingContext";
import { useLocalStorage } from "@mantine/hooks";

export default function page() {
  // const userType = (await params).userType;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    startTransition(() => {
      router.push(path);
    });
  };

  const { setLoading } = useLoading();

  const handleClick = () => {
    setLoading(true); // شروع بارگذاری
  };

  const handleComplete = () => {
    setLoading(false); // پایان بارگذاری
  };

  const role = useUserRole();
  const [user, setUser] = useState<UserType | Sf | null>(null);
  useEffect(() => {
    (async () => {
      const res = await getUserInfo();
      if (res.code == 200) {
        setUser(res.data);
      }
    })();
  }, []);

  // const salon: Sf = {
  //   name: "پیرایشگاه احمد",
  //   description: "شسینمتنشسمتیمن",
  //   address: "اصفهان- مدرس",
  //   contactNumber: "09395999832",
  //   images: ["", ""],
  // };

  const userLinks = [
    {
      text: "رزرو ها",
      href: "./user/reserves",
      icon: <CalendarSearchIcon />,
    },
   
  ];

  const salonLinks = [
    {
      text: "خدمات",
      href: "./profile/services",
      icon: <CalendarSearchIcon />,
    },
    {
      text: "رزرو ها",
      href: "./profile/reserves",
      icon: <CalendarSearchIcon />,
    },
    
    {
      text: "کارمندان",
      href: "./profile/employees",
      icon: <PersonStanding />,
    },
  ];
  const [token, setToken, removeToken] = useLocalStorage({
    key: "token",
    defaultValue: "",
  });
  const [roole, setRole, removeRole] = useLocalStorage({
    key: "role",
    defaultValue: "",
  });

  return (
    <div className="flex flex-col justify-center items-center gap-5 relative">
      {isPending || isLoading ? <LoadingSpinner /> : null}

      <Button
        onClick={() => handleNavigation("/")}
        className="!fixed right-5 top-5 z-10 !w-10 !h-10 !rounded-full !p-2 !bg-myellow"
      >
        <ArrowRight />
      </Button>
      <header className="flex flex-col justify-center items-center gap-5">
        {user ? (
          role == "SALON" ? (
            <SalonHeader salon={user as Sf} />
          ) : (
            <UserHeader user={user as UserType} />
          )
        ) : null}
        <Link
          href={`./profile/update/`}
          className="bg-myellow p-1 !rounded-lg !w-full "
          onClick={handleClick}
          onLoad={handleComplete}
        >
          <Button
            className="!bg-myellow p-1 !rounded-lg !w-full !font-bold !text-xl"
            classNames={{
              root: "!rounded-lg !w-full",
            }}
          >
            ویرایش
          </Button>
        </Link>
      </header>
      <main className="bg-white rounded-md p-2 w-full flex flex-col gap-5">
        <p className="text-[23px] space-y-2">تنظیمات کاربری</p>
        {role == "SALON"
          ? salonLinks.map((li, index) => (
              <Link
                href={li.href}
                className="flex justify-between items-center"
                key={index}
                onClick={handleClick}
                onLoad={handleComplete}
              >
                <div className="rounded-full w-10 h-10 p-2 bg-mgray border">
                  {li.icon}
                </div>
                <p className="text-[20px]">{li.text}</p>
                <ChevronLeft size={20} />
              </Link>
            ))
          : userLinks.map((li, index) => (
              <Link
                href={li.href}
                className="flex justify-between items-center"
                key={index}
              >
                <div className="rounded-full w-10 h-10 p-2 bg-mgray border">
                  {li.icon}
                </div>
                <p className="text-[20px]">{li.text}</p>
                <ChevronLeft size={20} />
              </Link>
            ))}
        <Link
          href={"/"}
          className="flex justify-between items-center"
          onClick={() => {
            removeRole();
            removeToken();
          }}
        >
          <div className="rounded-full w-10 h-10 p-2 bg-mgray border">
            <LogOut />
          </div>
          <p className="text-[20px]">خروج</p>
          <ChevronLeft size={20} />
        </Link>
      </main>
    </div>
  );
}
