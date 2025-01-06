"use client";
import { SalonProfile } from "@/lib/types/employee";
import { TextInput } from "@mantine/core";
import React, { Suspense, useEffect, useState, useTransition } from "react";
import SwiperComponent from "@/components/swipper";
import { SalonProfile as Sf } from "@/lib/types/employee";
import { Button } from "react-aria-components";
import { SalonProfileEdit } from "@/components/update-profile/SalonProfileEdit";
import useUserRole from "@/lib/hooks/useUserRole";
import { getUserInfo, updateProfile, updateSalon } from "@/lib/api";
import { UserType } from "@/lib/types/user";
import { useLoading } from "@/components/LoadingContext";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheckBig, XCircleIcon } from "lucide-react";
import { UserProfileEdit } from "@/components/update-profile/UserProfileEdit";
import { notifications } from "@mantine/notifications";
import Loading from "../loading";
export default function Page() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    startTransition(() => {
      router.push(path);
    });
  };

  // const salon: Sf = {
  //   name: "پیرایشگاه احمد",
  //   description: "شسینمتنشسمتیمن",
  //   location: "اصفهان- مدرس",
  //   contactNumber: "09395999832",
  //   images: ["", ""],
  // };

  const role = useUserRole();
  // "{
  //   name: "",
  //   images: [],
  //   location: "",
  //   description: "",
  //   contactNumber: "",
  // }"
  const [profile, setProfile] = useState<UserType | SalonProfile | null>(null);
  useEffect(() => {
    (async () => {
      if (!profile) {
        const res = await getUserInfo();
        if (res.code == 200) {
          const imgs = await res.data.images.filter((img: any) => img != null);
          console.log();
          setProfile({ ...res.data, images: imgs });
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* <Button
        onPress={() => handleNavigation("/profile")}
        className="!fixed right-5 top-5 z-10 !w-10 !h-10 !rounded-full !p-2 !bg-myellow"
      >
        <ArrowRight />
      </Button> */}
      <Suspense fallback={<Loading />}>
        {profile ? (
          role == "SALON" ? (
            <SalonProfileEdit
              profile={profile as SalonProfile}
              onSave={async (updatedProfile: SalonProfile) => {
                console.log(updatedProfile);

                const formData = new FormData();

                // اضافه کردن مقادیر ساده به فرم‌دیتا
                formData.append("name", updatedProfile.name);
                formData.append("location", updatedProfile.location);
                formData.append("description", updatedProfile.description);
                formData.append(
                  "contact_number",
                  updatedProfile.contact_number
                );

                // اضافه کردن تصاویر به فرم‌دیتا
                for (const [index, image] of updatedProfile.images.entries()) {
                  if (image.startsWith("/media")) {
                    // اگر تصویر از قبل در سرور موجود است، فایل آن دریافت می‌شود
                    const file = await fetch(`http://127.0.0.1:8000${image}`)
                      .then((res) => res.blob())
                      .then(
                        (blob) =>
                          new File([blob], `image_${index + 1}.jpg`, {
                            type: blob.type,
                          })
                      );

                    formData.append("images", file); // فایل تصویر اضافه می‌شود
                  } else {
                    // فایل تصویر جدید از URL دریافت می‌شود
                    const file = await fetch(image)
                      .then((res) => res.blob())
                      .then(
                        (blob) =>
                          new File([blob], `image_${index + 1}.jpg`, {
                            type: blob.type,
                          })
                      );

                    formData.append("images", file); // فایل تصویر اضافه می‌شود
                  }
                }

                try {
                  const res = await updateSalon(formData);
                  if (res.success) {
                    notifications.show({
                      message: res.success,
                      title: "موفق",
                      position: "top-center",
                      color: "green",
                      icon: <CircleCheckBig />,
                      autoClose: 2000,
                      onClose(props) {
                        router.push("/profile");
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
                  console.log("Profile updated successfully:", res.data);
                } catch (error) {
                  console.error("Error updating profile:", error);
                }
              }}
            />
          ) : (
            <UserProfileEdit
              profile={profile as UserType}
              onSave={async (values) => {
                const formData = new FormData();
                formData.append("first_name", values.first_name);
                formData.append("last_name", values.last_name);
                formData.append("email", values.email);

                // If the profileImage is a DataURL, convert it to a Blob

                if (values.image_profile!.startsWith("data:")) {
                  const blob = await (
                    await fetch(values.image_profile as string)
                  ).blob();
                  formData.append("image_profile", blob, "profile-image.png");
                }

                const res = await updateProfile(formData);
                console.log(res);
                if (res.success) {
                  notifications.show({
                    message: res.success,
                    title: "موفق",
                    position: "top-center",
                    color: "green",
                    icon: <CircleCheckBig />,
                    autoClose: 2000,
                    onClose(props) {
                      router.push("/profile");
                    },
                  });
                }
              }}
            />
          )
        ) : null}
      </Suspense>
    </div>
  );
}
