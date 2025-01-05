// usePersianDate.ts
import jalaali from "jalaali-js";
import { DateValue } from "react-aria";

const persianDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const usePersianDate = (date: DateValue | Date = new Date()) => {
  // اگر date از نوع DateValue باشد، تبدیل به Date
  const convertedDate =
    date instanceof Date ? date : new Date(date.year, date.month - 1, date.day);

  const { jy, jm, jd } = jalaali.toJalaali(
    convertedDate.getFullYear(),
    convertedDate.getMonth() + 1,
    convertedDate.getDate()
  );

  const weekDayIndex = convertedDate.getDay();
  const weekDay = persianDays[weekDayIndex];
  const month = persianMonths[jm - 1];

  return `${weekDay} ${jd} ${month} ${jy}`;
};

export default usePersianDate;
