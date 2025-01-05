"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Image from "next/image";
import { Button } from "@mantine/core";
import { Trash } from "lucide-react";

// تعریف تایپ Props
interface SwiperComponentProps {
  data: string[]; // لیست تصاویر از سمت سرور
  onImageChange: (updatedImages: (string | File)[]) => void; // تابع برای ارسال تغییرات
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({
  data,
  onImageChange,
}) => {
  const [existingImages, setExistingImages] = useState<string[]>([]); // تصاویر سرور

  useEffect(() => {
    // بارگذاری اولیه تصاویر از سمت سرور
    const filteredImages = data.filter((item): item is string => item !== null);
    setExistingImages(filteredImages);
  }, [data]);

  // حذف تصویر موجود (از سمت سرور)
  const handleDeleteExisting = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
    onImageChange([...updatedImages]); // ارسال ترکیب تصاویر باقی‌مانده به تابع
  };

  // // حذف تصویر جدید
  // const handleDeleteNew = (index: number) => {
  //   const updatedNewImages = newImages.filter((_, i) => i !== index);
  //   setNewImages(updatedNewImages);
  //   onImageChange([...existingImages, ...updatedNewImages]); // ارسال تصاویر باقی‌مانده
  // };

  // // افزودن تصویر جدید
  // const handleAddNewImage = () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.onchange = (event: Event) => {
  //     const target = event.target as HTMLInputElement;
  //     const file = target.files?.[0];
  //     if (file) {
  //       const updatedNewImages = [...newImages, file];
  //       setNewImages(updatedNewImages);
  //       onImageChange([...existingImages, ...updatedNewImages]); // به‌روزرسانی ترکیب تصاویر
  //     }
  //   };
  //   input.click();
  // };

  return (
    <div className="w-full py-10">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, EffectCoverflow]}
        className="mySwiper"
      >
        {/* تصاویر موجود */}
        {existingImages.map((image, index) => (
          <SwiperSlide
            key={`existing-${index}`}
            className="flex justify-center items-center"
          >
            <div className="relative flex flex-col justify-center items-center h-[150px] w-full">
              <Image
                src={
                  image!.startsWith("/media")
                    ? "http://127.0.0.1:8000/" + image
                    : image
                }
                alt={`Slide ${index}`}
                objectFit="cover"
                layout="fill"
              />
              <div className="absolute bottom-2 flex justify-center gap-2">
                <Button
                  size="xs"
                  color="red"
                  onClick={() => handleDeleteExisting(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* تصاویر جدید */}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
