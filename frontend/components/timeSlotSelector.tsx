import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@mantine/core";

// تبدیل زمان به دقیقه
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// تبدیل دقیقه به زمان
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

// تولید اسلات‌های زمانی با جلوگیری از رندرهای اضافی
const generateTimeSlots = (shifts: any[], duration: string) => {
  const durationMinutes = timeToMinutes(duration);
  const slots: { day: string; time: string }[] = [];

  shifts.forEach((shift) => {
    const startMinutes = timeToMinutes(shift.start_time);
    const endMinutes = timeToMinutes(shift.end_time);

    for (let current = startMinutes; current + durationMinutes <= endMinutes; current += durationMinutes) {
      slots.push({
        day: shift.day_of_week,
        time: minutesToTime(current),
      });
    }
  });
  return slots;
};

interface TimeSlotSelectorProps {
  shifts: any[];
  duration: string;
  onSelectTimeSlot: (slot: { day: string; time: string }) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  shifts,
  duration,
  onSelectTimeSlot,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);

  // استفاده از useMemo برای جلوگیری از رندر بی‌پایان
  const timeSlots = useMemo(() => generateTimeSlots(shifts, duration), [shifts, duration]);

  // بهینه‌سازی تابع انتخاب زمان با useCallback
  const handleSlotClick = useCallback(
    (slot: { day: string; time: string }) => {
      setSelectedSlot(slot);
      onSelectTimeSlot(slot);
    },
    [onSelectTimeSlot]
  );

  // نگاشت روزهای هفته به فارسی
  const persianDays: { [key: string]: string } = {
    SUNDAY: "یکشنبه",
    MONDAY: "دوشنبه",
    TUESDAY: "سه‌شنبه",
    WEDNESDAY: "چهارشنبه",
    THURSDAY: "پنج‌شنبه",
    FRIDAY: "جمعه",
    SATURDAY: "شنبه",
  };

  return (
    <div className="p-4 border rounded-lg overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            {Object.values(persianDays).map((day, index) => (
              <th key={index} className="p-2 border text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(persianDays).map((day, index) => (
              <td key={index} className="p-2 border align-top">
                <div className="h-[300px] overflow-y-scroll flex flex-col items-center gap-2">
                  {timeSlots
                    .filter((slot) => slot.day === day)
                    .map((slot, idx) => (
                      <Button
                        key={idx}
                        size="md"
                        fullWidth
                        className="w-[120px]" // بهبود اندازه دکمه‌ها
                        variant={selectedSlot?.time === slot.time && selectedSlot?.day === slot.day ? "filled" : "outline"}
                        onClick={() => handleSlotClick(slot)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotSelector;
