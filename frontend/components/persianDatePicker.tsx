"use client";

import React, { useState } from "react";
import { I18nProvider } from "react-aria";
import {
  Group,
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Heading,
  Label,
  Popover,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
} from "react-aria-components";
import {
  getLocalTimeZone,
  today,
  parseDate,
  DateValue,
} from "@internationalized/date";
import { Calendar1Icon } from "lucide-react";
interface PersianDatePickerProps {
  unavailableDates?: DateValue[]; // Array of unavailable dates
  onDateChange?: (date: string | any) => void; // Callback when the date changes
  defaultValue?: DateValue; // Default selected date
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  unavailableDates = [],
  onDateChange,
  defaultValue,
}) => {
  const emrooz = today(getLocalTimeZone());
  const [selectedDate, setSelectedDate] = useState(defaultValue || emrooz);

  // Check if a date is unavailable
  const isUnavailableDate = (date: DateValue) => {
    return (
      unavailableDates.some((d: DateValue) => d.compare(date) === 0) ||
      date.compare(emrooz) < 0
    );
  };

  // Handle date selection

  return (
    <I18nProvider locale="fa-IR-u-ca-persian">
      <DatePicker
        placeholderValue={emrooz}
        defaultValue={defaultValue || emrooz}
        isDateUnavailable={isUnavailableDate}
        onChange={onDateChange}
      >
        <Group className="flex justify-between rounded-lg py-2 px-5 relative w-full flex-row-reverse bg-white items-center">
          <DateInput className="flex flex-row-reverse text-[20px]">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <Button>
            <Calendar1Icon size={35} />
          </Button>
        </Group>

        <Popover
          className="flex justify-center w-full bg-white rounded-lg"
          placement="bottom end"
        >
          <Dialog className="w-full p-8">
            <Calendar className="w-full">
              <header className="flex justify-between w-full text-[20px]">
                <Button slot="previous">▶</Button>
                <Heading />
                <Button slot="next">◀</Button>
              </header>
              <CalendarGrid className="w-full border-separate border-spacing-2">
                <CalendarGridHeader className="mb-5">
                  {(day) => (
                    <CalendarHeaderCell
                      className="rounded-full bg-white p-2"
                      children={day}
                    />
                  )}
                </CalendarGridHeader>
                <CalendarGridBody className="mt-5">
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className={`p-2 flex justify-center items-center rounded-md cursor-pointer 
                        ${
                          isUnavailableDate(date)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : selectedDate.compare(date) === 0
                            ? "bg-yellow-300"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  );
};

export default PersianDatePicker;
