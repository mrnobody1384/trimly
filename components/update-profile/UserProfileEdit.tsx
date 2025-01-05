import React, { useEffect, useState } from "react";
import { TextInput, Group, Button, Stack, Avatar } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FileButton } from "@mantine/core";
import { Upload } from "lucide-react";
import { UserType } from "@/lib/types/user";

interface UserProfileEditProps {
  profile: UserType;
  onSave: (profile: UserType) => void;
}

export function UserProfileEdit({ profile, onSave }: UserProfileEditProps) {
  // useEffect(()=>{},[])
  const form = useForm({
    initialValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      image_profile: "http://127.0.0.1:8000" + profile.image_profile,
    },
  });

  console.log(profile);
  const [previewImage, setPreviewImage] = useState(
    "http://127.0.0.1:8000" + profile.image_profile
  );

  const handleProfileImageChange = (payload: File | null) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setPreviewImage(imageDataUrl);
      form.setFieldValue("image_profile", imageDataUrl);
    };
    reader.readAsDataURL(payload as File);
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSave(values))}
      className="w-3/4 mx-auto"
    >
      <Stack className="!justify-center !items-center !gap-3">
        {/* نمایش تصویر پروفایل */}
        <div className="flex justify-center items-center">
          <Avatar src={previewImage} size={120} radius="xl" />
        </div>

        {/* آپلود تصویر */}
        <Group>
          <FileButton onChange={handleProfileImageChange} accept="image/*">
            {(props) => (
              <Button {...props} color="blue">
                تغییر تصویر پروفایل <Upload />
              </Button>
            )}
          </FileButton>
        </Group>

        {/* فیلدهای اطلاعات کاربر */}
        <TextInput
          label="نام"
          placeholder="نام خود را وارد کنید"
          {...form.getInputProps("first_name")}
        />

        <TextInput
          label="نام خانوادگی"
          placeholder="نام خانوادگی خود را وارد کنید"
          {...form.getInputProps("last_name")}
        />

        {/* <TextInput
          label="شماره تلفن همراه"
          placeholder="شماره تلفن همراه خود را وارد کنید"
          {...form.getInputProps("phone_number")}
        /> */}
        <TextInput
          label="ایمیل"
          placeholder="ایمیل خود را وارد کنید"
          {...form.getInputProps("email")}
        />

        {/* دکمه ذخیره */}
        <Group mt="lg">
          <Button type="submit" color="yellow">
            ذخیره تغییرات
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
