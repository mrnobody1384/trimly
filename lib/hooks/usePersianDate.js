import jalaali from "jalaali-js";
import { DateValue } from "react-aria";

import { getLocalTimeZone } from "@internationalized/date";
export default function usePersianDate(date) {
  const gregorianDate = date.toDate(getLocalTimeZone()); // Provide the timeZone here
  const persianDate = jalaali.toJalaali(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth() + 1,
    gregorianDate.getDate()
  );

  // Format the Persian date as a string, e.g., "1403/09/25"
  const formattedPersianDate = `${persianDate.jy}/${
    persianDate.jm < 10 ? "0" : ""
  }${persianDate.jm}/${persianDate.jd < 10 ? "0" : ""}${persianDate.jd}`;

  return formattedPersianDate;
}
