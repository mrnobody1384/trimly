"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Stepper,
  Button,
  Group,
  Select,
  Container,
  Radio,
  Center,
  Card,
  Stack,
  Text,
} from "@mantine/core";
import { DateValue } from "react-aria";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import PersianDatePicker from "@/components/persianDatePicker";
import usePersianDate from "@/lib/hooks/usePersianDate";
import { createAppointment, getSalon } from "@/lib/api";
import ExpertCard from "@/components/expertCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import TimeSlotSelector from "@/components/timeSlotSelector";
import { notifications } from "@mantine/notifications";
import { CheckIcon, CircleCheckBig, XCircleIcon } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const { salonId }: { salonId: string } = useParams();
  const emrooz: any = today(getLocalTimeZone());
  const [salon, setSalon] = useState<any>({});
  const [weekDayTxt, setweekDayTxt] = useState("");
  const [book, setBook] = useState({
    date: "",
    time: "",
    expertId: "",
    serviceId: "",
    salonId,
  });
  const [active, setActive] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getSalon(salonId);
      if (res.success) setSalon(res.data);
    })();
  }, [salonId]);

  const unavailableDates = [
    parseDate("1403-09-20"),
    // parseDate("1403-09-21"),
    // parseDate("1403-09-22"),
  ];

  const handleDateChange = (datee: DateValue) => {
    const { date, weekTxt } = usePersianDate(datee);
    setweekDayTxt(weekTxt);
    setBook((prev) => ({ ...prev, date }));
  };

  const nextStep = () => {
    if (active === 1 && !book.expertId) {
      return; // جلوگیری از ادامه در صورتی که کارمند انتخاب نشده باشد
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSelectExpert = async (id: string) => {
    const expert = salon?.employees.find((emp: any) => emp.id === id);
    if (expert?.id !== selectedExpert?.id) {
      setSelectedExpert(expert);
      setBook((prev) => ({ ...prev, expertId: id }));
    }
  };

  const handleSelectService = useCallback(
    (serviceId: string) => {
      if (book.serviceId === serviceId) return;
      setBook((prev) => ({
        ...prev,
        serviceId: serviceId,
      }));
    },
    [book.serviceId]
  );

  const isExpertAvailableOnDate = (
    shifts: any[],
    selectedDate: string
  ): boolean => {
    const weekDay = new Date(selectedDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    return shifts.some((shift) => shift.day_of_week === weekDay);
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.yoursite.com/payment", {
        method: "POST",
        body: JSON.stringify({ paymentMethod }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("مشکلی در پردازش پرداخت پیش آمد");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (active === 0) {
      // بررسی اینکه تمام فیلدها پر شده باشند
      const isBookValid = Object.entries(book).every(
        ([key, value]) => value !== ""
      );

      // چک کردن توکن
      const token = localStorage.getItem("token"); // یا هر جایی که توکن ذخیره می‌شود

      if (!isBookValid) {
        return; // فیلدها پر نشده است، دکمه غیر فعال باقی می‌ماند
      }

      if (!token) {
        notifications.show({
          message: "برای ادامه فرایند رزرو بابد ورود کنید",
          title: "خطا",
          position: "top-center",
          color: "red",
          icon: <XCircleIcon />,
          autoClose: 2000,
          onClose(props) {
            window.location.href = "/auth";
          },
        });
        // اگر توکن وجود ندارد، نمایش نوتیفیکیشن با استفاده از notifications.show
      } else {
        // اگر توکن وجود دارد، به مرحله بعد برو
        setActive((current) => (current < 4 ? current + 1 : current));
      }
    }

    if (active === 1) {
      try {
        const data = {
          service_id: book.serviceId,
          salon_id: salonId,
          employee_id: book.expertId,
          appointment_date: `${book.date}-${book.time}`,
        };
        const response = await createAppointment(data);

        setBookingResponse(response.data); // ذخیره پاسخ در state
        notifications.show({
          title: "موفقیت آمیز!",
          message: "رزرو شما با موفقیت ثبت شد",
          color: "green",
          position: "top-center",
        });
        setActive((current) => (current < 4 ? current + 1 : current));
      } catch (error: any) {
        notifications.show({
          title: "خطا در ثبت رزرو",
          message: error.error || "خطایی رخ داده است.",
          color: "red",
          position: "top-center",
        });
      }
    } else {
      // در سایر مراحل فقط به مرحله بعدی بروید
      setActive((current) => (current < 4 ? current + 1 : current));
    }
  };

  const isBookComplete =
    book.date && book.time && book.expertId && book.serviceId;

  return (
    <div>
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
          {salon?.images?.map((image: string, index: number) => (
            <SwiperSlide
              key={`existing-${index}`}
              className="flex justify-center items-center h-[180px] w-full rounded-lg !bg-white"
            >
              <div className="relative flex flex-col justify-center items-center h-[200px] w-full rounded-lg bg-white">
                <Image
                  src={"http://127.0.0.1:8000" + image}
                  alt={`Slide ${index}`}
                  fill
                  className="aspect-video rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
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
            <div
              id="Experts"
              className="flex gap-4 overflow-x-scroll mt-5 bg-white p-2 rounded-lg"
            >
              {salon?.employees
                ?.filter((expert: any) =>
                  isExpertAvailableOnDate(expert.shifts, book.date)
                )
                .map((expert: any) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    isSelected={book.expertId === expert.id}
                    onSelect={handleSelectExpert}
                  />
                ))}
            </div>
            {selectedExpert && (
              <div className="mt-2">
                <Select
                  classNames={{
                    label: "!text-2xl !font-bold mb-1",
                  }}
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
            {book.time ? (
              <div className="text-center text-2xl font-bold mt-10">
                زمان انتخاب شده {book.time}
              </div>
            ) : (
              book?.serviceId && (
                <TimeSlotSelector
                  shifts={selectedExpert?.shifts}
                  serviceId={book?.serviceId}
                  services={selectedExpert?.services}
                  onSelect={(time: string) => setBook({ ...book, time })}
                  weekTxt={weekDayTxt}
                />
              )
            )}
          </Stepper.Step>

          <Stepper.Step label="پرداخت">
            <Container>
              <h3 className="text-2lg font-bold">انتخاب نوع پرداخت</h3>
              <Group>
                <Radio.Group
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  classNames={{
                    label: "text-lg font-bold",
                    root: "space-y-5",
                  }}
                  label="نوع پرداخت"
                >
                  <Radio
                    value="online"
                    label="پرداخت آنلاین (در حال پیاده سازی)"
                    disabled
                    className="text-gray-800 text-lg"
                  />
                  <Radio
                    value="inPerson"
                    label="پرداخت حضوری"
                    className="mt-5 text-lg"
                  />
                </Radio.Group>
              </Group>
            </Container>
          </Stepper.Step>
          <Stepper.Completed>
            <Container>
              <Center>
                <Card
                  shadow="sm"
                  padding="lg"
                  style={{ maxWidth: 400, marginTop: 50, textAlign: "center" }}
                >
                  <Stack>
                    {/* آیکون تیک سبز */}
                    <CheckIcon size={50} color="green" />

                    {/* عنوان تایید رزرو */}
                    <Text size="xl">رزرو شما با موفقیت انجام شد!</Text>

                    {/* نمایش اطلاعات رزرو */}
                    <Text size="sm" color="dimmed">
                      {/* سالن: {bookingResponse!.salonName} */}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {/* تاریخ رزرو: {bookingResponse!.reservationDate} */}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {/* ساعت رزرو: {bookingResponse!.reservationTime} */}
                    </Text>

                    {/* دکمه برگشت به صفحه اصلی */}
                    <Button onClick={() => {}} fullWidth>
                      برگشت به صفحه اصلی
                    </Button>
                  </Stack>
                </Card>
              </Center>
            </Container>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            مرحله قبل
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={
              active === 0 &&
              !Object.entries(book).every(([key, value]) => value !== "")
            }
          >
            مرحله بعدی
          </Button>
        </Group>
      </div>
    </div>
  );
}
