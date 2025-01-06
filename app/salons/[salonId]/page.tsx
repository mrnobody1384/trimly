"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Stepper, Button, Group, Select } from "@mantine/core";
import { DateValue } from "react-aria";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import PersianDatePicker from "@/components/persianDatePicker";
import usePersianDate from "@/lib/hooks/usePersianDate";
import { getSalon } from "@/lib/api";
import { SalonProfile } from "@/lib/types/employee";
import ExpertCard from "@/components/expertCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import TimeSlotSelector from "@/components/timeSlotSelector";
export default function Page() {
  const { salonId }: { salonId: string } = useParams();
  const emrooz: any = today(getLocalTimeZone());
  const [salon, setSalon] = useState<any>({});
  const [book, setBook] = useState({
    date: "",
    time: "",
    expertId: "",
    serviceId: "",
    day: "",
  });
  const [active, setActive] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getSalon(salonId);
      if (res.success) setSalon(res.data);
    })();
  }, []);

  const unavailableDates = [
    parseDate("1403-09-20"),
    parseDate("1403-09-21"),
    parseDate("1403-09-22"),
  ];

  const handleDateChange = (date: DateValue) =>
    setBook((prev) => ({ ...prev, date: usePersianDate(date) }));

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSelectExpert = async (id: string) => {
    const expert = salon?.employees.find((emp: any) => emp.id === id);

    // Only update state if the expert changes
    if (expert?.id !== selectedExpert?.id) {
      setSelectedExpert(expert);
      setBook((prev) => ({ ...prev, expertId: id }));
    } // ریست کردن سرویس هنگام انتخاب کارمند جدید
  };
  console.log(selectedExpert);

  const handleSelectService = useCallback(
    (serviceId: string) => {
      // جلوگیری از به‌روزرسانی غیرضروری
      if (book.serviceId === serviceId) return;

      setBook((prev) => ({
        ...prev,
        serviceId: serviceId,
      }));
    },
    [book.serviceId]
  );
  // باز کردن مدال و نمایش تصویر
  return (
    <div>
      {/* مدال برای نمایش تصویر */}

      {/* گالری تصاویر */}
      <div id="Images">
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
          {salon?.images?.map((image: string, index: number) => (
            <SwiperSlide
              key={`existing-${index}`}
              className="flex justify-center items-center h-[180px] w-full rounded-lg !bg-white"
            >
              <div className="relative flex flex-col justify-center items-center h-[200px] w-full rounded-lg bg-white">
                <Image
                  src={"http://127.0.0.1:8000/" + image}
                  alt={`Slide ${index}`}
                  fill
                  className="aspect-video rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}

          {/* تصاویر جدید */}
        </Swiper>
      </div>

      {/* انتخاب تاریخ و استپر */}
      <div className="bookDate mt-5">
        <PersianDatePicker
          unavailableDates={unavailableDates}
          onDateChange={handleDateChange}
        />
      </div>

      <div id="steper" className="mt-[30px]">
        <Stepper active={active} onStepClick={setActive} iconSize={28}>
          <Stepper.Step label="رزرو">
            <h2 className="font-bold text-2xl">انتخاب پیرایشگر</h2>
            <div id="Experts" className="flex gap-4 overflow-x-scroll mt-5">
              {salon?.employees?.map(
                (expert: {
                  id: string;
                  first_name: string;
                  last_name: string;
                  image_profile: string;
                }) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    isSelected={book.expertId === expert.id}
                    onSelect={handleSelectExpert}
                  />
                )
              )}
            </div>
            {selectedExpert && (
              <div className="mt-5">
                <Select
                  label="انتخاب سرویس"
                  placeholder="یک سرویس انتخاب کنید"
                  data={selectedExpert?.services.map((service: any) => ({
                    value: service.id,
                    label: `${service.name} - ${service.duration} دقیقه`,
                  }))}
                  onChange={(value) => handleSelectService(value as string)}
                />
              </div>
            )}
            <TimeSlotSelector
              shifts={selectedExpert?.shifts || []}
              duration={
                selectedExpert?.services.find(
                  (s: any) => s.id === book.serviceId
                )?.duration || "00:30:00"
              }
              onSelectTimeSlot={(slot) => {
                setBook((prev) => ({
                  ...prev,
                  date: slot.day,
                  time: slot.time,
                }));
              }}
            />
          </Stepper.Step>
          <Stepper.Step label="مشخصات">مشخصات مشتری</Stepper.Step>
          <Stepper.Step label="پرداخت">پرداخت هزینه</Stepper.Step>
          <Stepper.Completed>رزرو شما تکمیل شد!</Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            مرحله قبل
          </Button>
          <Button onClick={nextStep}>مرحله بعدی</Button>
        </Group>
      </div>
    </div>
  );
}
