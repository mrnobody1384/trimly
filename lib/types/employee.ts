export interface Employee {
  id?: string;
  user_first_name: string;
  user_last_name: string;
  user_image_profile: string;
  user_phone_number: string;

  service_ids: string[];
  shifts: {
    start: TimeValue | null;
    end: TimeValue;
    days: number[];
  };
}

export interface SalonProfile {
  id?: string;
  name: string;
  location: string;
  images: string[];
  description: string;
  contact_number: string;
  services?: string[];
  employees?: Employee[];
}

import { TimeValue } from "react-aria";
import { z } from "zod";

export const employeeSchema = z.object({
  user_first_name: z.string().nonempty("نام الزامی است"),
  user_last_name: z.string().nonempty("نام خانوادگی الزامی است"),
  user_image_profile: z.string().optional(),
  service_ids: z.array(z.number()).nonempty("حداقل یک تخصص انتخاب کنید"),
  shifts: z.object({
    days: z.array(z.string()).nonempty("حداقل یک روز انتخاب کنید"),
  }),
});
