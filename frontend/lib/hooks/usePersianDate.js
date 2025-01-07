import jalaali from "jalaali-js";
import { getLocalTimeZone } from "@internationalized/date";

export default function usePersianDate(date) {
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

  const gregorianDate = date.toDate(getLocalTimeZone());

  // تبدیل تاریخ به تقویم شمسی
  const persianDate = jalaali.toJalaali(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth() + 1,
    gregorianDate.getDate()
  );

  // اصلاح ایندکس روز هفته (تبدیل یکشنبه به شنبه)
  const dayOfWeek = (gregorianDate.getDay() + 1) % 7;
  const persianDayOfWeek = persianDays[dayOfWeek]; 

  // فرمت تاریخ شمسی همراه با روز هفته
  const formattedPersianDate = `${persianDate.jy}-${
    persianDate.jm < 10 ? "0" : ""
  }${persianDate.jm}-${persianDate.jd < 10 ? "0" : ""}${persianDate.jd}`;

  return {date:formattedPersianDate,weekTxt:persianDayOfWeek};
}
