import { TextInput, Textarea, Group, Button, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Upload } from "lucide-react";
import { SalonProfile } from "@/lib/types/employee";
import SwiperComponent from "../swipper";
import { FileButton } from "@mantine/core";

interface SalonProfileEditProps {
  profile: SalonProfile;
  onSave: (profile: SalonProfile) => void;
}

export function SalonProfileEdit({ profile, onSave }: SalonProfileEditProps) {
  const form = useForm({
    initialValues: {
      name: profile.name,
      location: profile.location,
      description: profile.description,
      contact_number: profile.contact_number,
      images: profile.images,
    },
  });

  const handleFilesUpload = (uploadedFiles: File[]) => {
    const newImages = uploadedFiles.map((file) => URL.createObjectURL(file));
    form.setFieldValue(
      "images",
      [...form.values.images, ...newImages].slice(0, 4)
    ); // حداکثر ۴ تصویر
  };

  // دریافت تغییرات تصاویر از SwiperComponent
  const handleImageChange = (updatedImages: (string | File)[]) => {
    // تبدیل آرایه جدید به نوع مناسب
    const updatedImagesOnlyString = updatedImages.filter(
      (image) => typeof image === "string"
    );
    form.setFieldValue("images", updatedImagesOnlyString);
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => onSave(values as SalonProfile))}
      className="w-3/4"
    >
      <Stack>
        <TextInput
          label="نام سالن"
          placeholder="نام سالن خود را وارد کنید"
          {...form.getInputProps("name")}
        />

        <TextInput
          label="شماره تماس"
          placeholder="شماره تماس سالن"
          {...form.getInputProps("contact_number")}
          disabled={true}
        />

        <Textarea
          label="آدرس"
          placeholder="آدرس سالن"
          {...form.getInputProps("location")}
        />

        <Textarea
          label="توضیحات"
          placeholder="توضیحات سالن"
          {...form.getInputProps("description")}
        />

        {/* تصاویر */}
        {form.values.images.length > 0 && (
          <div>
            <SwiperComponent
              data={form.values.images}
              onImageChange={handleImageChange} // ارسال تغییرات به فرم
            />
          </div>
        )}

        {/* آپلود تصاویر در صورت کمتر بودن تعداد تصاویر از ۴ */}
        {form.values.images.length < 4 && (
          <Group justify="center" mt="md" className="w-full">
            <FileButton
              onChange={handleFilesUpload}
              accept="image/png,image/jpeg"
              multiple
            >
              {(props) => (
                <Button {...props} type="button" className="!w-full">
                  آپلود تصویر <Upload />
                </Button>
              )}
            </FileButton>
          </Group>
        )}

        {/* نمایش لیست تصاویر انتخاب‌شده */}
        <Button type="submit" color="yellow" className="w-full">
          ذخیره تغییرات
        </Button>
      </Stack>
    </form>
  );
}
