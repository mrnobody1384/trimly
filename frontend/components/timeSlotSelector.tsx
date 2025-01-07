"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@mantine/core";

// تعریف تایپ‌ها برای TypeScript
interface Shift {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface Service {
  id: string;
  name: string;
  duration: string; // قالب: "00:HH:MM"
}

interface TimeSlotSelectorProps {
  shifts: Shift[];
  serviceId: string;
  services: Service[];
  onSelect: (time: string) => void;
  weekTxt: string;
}

const englishToPersianDays: { [key: string]: string } = {
  SATURDAY: "ش",
  SUNDAY: "ی",
  MONDAY: "د",
  TUESDAY: "س",
  WEDNESDAY: "چ",
  THURSDAY: "پ",
  FRIDAY: "ج",
};

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  shifts,
  serviceId,
  services,
  onSelect,
  weekTxt,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const slotsPerPage = 6;

  // انتخاب سرویس و مدت زمان آن
  const selectedService = services.find((service) => service.id === serviceId);
  const duration = selectedService ? selectedService.duration : "00:01:00";

  const durationMinutes = useMemo(() => {
    const [hours, minutes] = duration.split(":").slice(1).map(Number);
    return hours * 60 + minutes;
  }, [duration]);

  // تولید اسلات‌های زمانی برای هر شیفت
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
      currentMinutes += durationMinutes;
    }

    return slots;
  };

  // تولید اسلات‌های زمانی برای تمام شیفت‌ها
  const allSlots = useMemo(() => {
    const slotsByDay: { [key: string]: string[] } = {};

    Object.values(englishToPersianDays).forEach((day) => {
      slotsByDay[day] = [];
    });

    shifts.forEach((shift) => {
      const day = englishToPersianDays[shift.day_of_week];
      slotsByDay[day] = generateTimeSlots(shift.start_time, shift.end_time);
    });

    return slotsByDay;
  }, [shifts, durationMinutes]);

  // صفحه‌بندی اسلات‌ها
  const paginatedSlots = useMemo(() => {
    const paginated: { [key: string]: string[] } = {};
    Object.entries(allSlots).forEach(([day, slots]) => {
      paginated[day] = slots.slice(
        currentPage * slotsPerPage,
        (currentPage + 1) * slotsPerPage
      );
    });
    return paginated;
  }, [allSlots, currentPage]);

  const weekTxtPersian: string = weekTxt.charAt(0);

  return (
    <div className="time-slot-selector border p-4 rounded-lg overflow-hidden w-full">
      {/* هدر روزهای هفته */}
      <div className="grid grid-cols-7 text-center border-b mb-4 pb-2 text-sm">
        {Object.values(englishToPersianDays).map((day) => (
          <div
            key={day}
            className={`${
              day === weekTxtPersian
                ? "text-white bg-blue-600 p-2 rounded-lg"
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* نمایش اسلات‌های زمانی به درستی زیر هر روز */}
      <div className="grid grid-cols-7 gap-2 overflow-y-scroll max-h-[300px]">
        {Object.values(englishToPersianDays).map((day) => (
          <div key={day} className="flex flex-col items-center space-y-2">
            {paginatedSlots[day]?.map((time, index) => (
              <button
                key={index}
                className="border w-full text-center rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
                onClick={() => onSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* دکمه‌های صفحه‌بندی */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="default"
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          قبلی
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={Object.values(paginatedSlots).every(
            (slots) => slots.length < slotsPerPage
          )}
        >
          بعدی
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
