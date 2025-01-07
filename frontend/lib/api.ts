"use client";
import axios, { AxiosError } from "axios";
import { Employee } from "./types/employee";

// const ax = axios.create({});
import { readLocalStorageValue } from "@mantine/hooks";
import { useLocalStorage } from "@mantine/hooks";
const ax = axios.create({
  baseURL: "http://localhost:8000/api/v1/", // Replace with your API base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

const token = readLocalStorageValue({ key: "token" });

const authcli = axios.create({
  baseURL: "http://localhost:8000/api/v1/", // Replace with your API base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ? token : null}`,
  },
});

// Define the structure of your API response
export interface ApiResponse {
  error: any;
  code: number; // Custom error code
  success: string | null;
  data?: any; // Optional field for additional response data
}

// Expert (Employee) Management.
export async function createExpert(values: any): Promise<ApiResponse> {
  try {
    const response = await authcli.postForm(
      "/service/add-employee-to-salon/",
      values
    );

    return response.data; // Assuming the response contains a success message or the created entity
  } catch (error: any) {
    return {
      error: error?.response?.data || "Failed to create expert",
      code: 1002, // Custom error code for expert creation
      success: null,
    };
  }
}
export async function deleteExpert(id: string): Promise<ApiResponse> {
  try {
    const res = await authcli.delete("/service/delete-employee-to-salon/", {
      params: {
        employee_id: id,
      },
    });
    if (res.status == 202) {
      return {
        code: 200,
        success: "کارمند با موفقیت حذف شد",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in UpdateSalon", error);
      return {
        error: error.response?.data.images[0]
          ? "حداقل یک تصویر باید انتخاب شود"
          : error.response?.data.location[0]
          ? "آدرس نباید خالی باشد"
          : "مشکلی در اطلاعات وارد شده وجود داشت",

        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}
export async function updateExpert(form: any) {
  try {
    const res = await authcli.putForm("/service/salon-update/", form);
    console.log(res);
    if (res.status == 202) {
      return {
        code: 200,
        success: "اطلاعات با موفقیت بروزرسانی شد",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in UpdateSalon", error);
      return {
        error: error.response?.data.images[0]
          ? "حداقل یک تصویر باید انتخاب شود"
          : error.response?.data.location[0]
          ? "آدرس نباید خالی باشد"
          : "مشکلی در اطلاعات وارد شده وجود داشت",

        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}
export async function getEmployees(): Promise<ApiResponse> {
  try {
    const res = await authcli.get("/service/employee-salon-list/");
    if (res.status == 200) {
      return {
        code: 200,
        success: "کارمند با موفقیت حذف شد",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in UpdateSalon", error);
      return {
        error: error.response?.data.images[0]
          ? "حداقل یک تصویر باید انتخاب شود"
          : error.response?.data.location[0]
          ? "آدرس نباید خالی باشد"
          : "مشکلی در اطلاعات وارد شده وجود داشت",

        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

// Auth
export async function register(data: any): Promise<ApiResponse> {
  try {
    const res = await ax.post("/account/register/", data);
    if (res.status === 200) {
      return {
        error: null,
        code: 200,
        success: "ثبت نام با موفقیت انجام شد.",
      };
    }
    // Add a default return if res.status is not 200
    return {
      error: "خطای نامشخص رخ داده است.",
      code: res.status,
      success: null,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام ثبت‌نام رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    // Catch-all for unexpected errors
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function login(data: { phone_number: string }) {
  try {
    const res = await ax.post("/account/login/", data);
    if (res.status === 200) {
      return {
        error: null,
        code: 200,
        success: "کد تایید با موفقیت ارسال شد.",
      };
    }
    // Add a default return if res.status is not 200
    return {
      error: "خطای نامشخص رخ داده است.",
      code: res.status,
      success: null,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام ورود رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    // Catch-all for unexpected errors
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function verifyOtp(otp: string): Promise<ApiResponse> {
  try {
    let res = await ax.post("/account/verify/", {
      otp_code: otp,
    });

    if (res.status == 200) {
      console.log(res.data);
      return {
        code: 200,
        error: null,
        success: "کد با موفقیت تایید شد.",
        data: res.data,
      };
    } else {
      return {
        code: 400,
        error: res.data[0],
        success: null,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    // Catch-all for unexpected errors
    console.log(error);
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function getUserInfo(): Promise<ApiResponse> {
  try {
    const res = await authcli.get("/account/user-info/");
    console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

// Salon Or User Management
export async function UpgradeToSalon() {
  try {
    const res = await authcli.get("/account/assign-user-to-admin-salon/");
    console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success:
          "درخواست شما با موفقیت ثبت شد. برای ادامه خارج میشوید لطفا مجددا وارد شوید",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "باید مجدد لاگین کنید",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function updateSalon(form: any): Promise<ApiResponse> {
  try {
    const res = await authcli.putForm("/service/salon-update/", form);
    console.log(res);
    if (res.status == 202) {
      return {
        code: 200,
        success: "اطلاعات با موفقیت بروزرسانی شد",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in UpdateSalon", error);
      return {
        error: error.response?.data.images[0]
          ? "حداقل یک تصویر باید انتخاب شود"
          : error.response?.data.location[0]
          ? "آدرس نباید خالی باشد"
          : "مشکلی در اطلاعات وارد شده وجود داشت",

        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function updateProfile(form: any): Promise<ApiResponse> {
  try {
    const res = await authcli.putForm("/account/update-profile/", form);
    console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "اطلاعات با موفقیت بروزرسانی شد",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

// Service Management

export async function createExpertise(form: any): Promise<ApiResponse> {
  try {
    const res = await authcli.post("/service/service-create/", form);
    console.log(res);
    if (res.status == 201) {
      return {
        code: 201,
        success: "خدمت با موفقیت ایجاد گردید",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function getSalonAppointments(): Promise<ApiResponse> {
  try {
    const res = await authcli.get("/service/salon-appointment-list/");
    console.log(res);
    if (res.status == 201) {
      return {
        code: 201,
        success: "خدمت با موفقیت ایجاد گردید",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function getAllService(): Promise<ApiResponse> {
  try {
    const res = await ax.get("/service/service-list/");
    // console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

// discount (Giftcards) Management

// export async function createDiscount(data: any): Promise<ApiResponse> {
//   try {
//     const res = await authcli.post("/service/discount-code-check/", data);
//     console.log(res);
//     if (res.status == 201) {
//       return {
//         code: 201,
//         success: "خدمت با موفقیت ایجاد گردید",
//         data: res.data,
//         error: null,
//       };
//     }
//     return {
//       code: 401,
//       success: null,
//       error: "error",
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.request && !error.response) {
//         return {
//           error: "لطفا اتصال اینرنت خود را بررسی کنید",
//           code: 400,
//           success: null,
//         };
//       }
//       console.log("Error in Register", error);
//       return {
//         error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
//         code: error.response?.status || 500,
//         success: null,
//       };
//     }
//     return {
//       error: "یک خطای ناشناخته رخ داده است.",
//       code: 500,
//       success: null,
//     };
//   }
// }

export async function getUserAppointments(): Promise<ApiResponse> {
  try {
    const res = await authcli.get("/account/user-appointment-list/");
    console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function getAllSalons(): Promise<ApiResponse> {
  try {
    const res = await ax.get("/service/salon-list/");
    // console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function getSalon(id: string): Promise<ApiResponse> {
  try {
    const res = await ax.get("/service/salon-detail/", {
      params: {
        salon_id: id,
      },
    });
    // console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}

export async function searchSalons(searchTerm: string): Promise<ApiResponse> {
  try {
    const res = await ax.post("/service/salon-search/", {
      salon_name: searchTerm,
    });
    // console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}
export async function getSalonsByLocation(
  latitude: number,
  longitude: number
): Promise<ApiResponse> {
  try {
    const res = await ax.get("/service/salon-search-location/", {
      params: {
        x: longitude,
        y: latitude,
      },
    });
    // console.log(res);
    if (res.status == 200) {
      return {
        code: 200,
        success: "دیتا با موفقیت دریافت شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}


export async function createAppointment(data: any): Promise<ApiResponse> {
  try {
    const res = await authcli.post("/service/appointment-create/", data);
    console.log(res);
    if (res.status == 201) {
      return {
        code: 201,
        success: "رزرو با موفقیت انجام شد.",
        data: res.data,
        error: null,
      };
    }
    return {
      code: 401,
      success: null,
      error: "error",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        return {
          error: "لطفا اتصال اینرنت خود را بررسی کنید",
          code: 400,
          success: null,
        };
      }
      console.log("Error in Register", error);
      return {
        error: error.response?.data[0] || "خطا در هنگام تایید کد رخ داده است.",
        code: error.response?.status || 500,
        success: null,
      };
    }
    return {
      error: "یک خطای ناشناخته رخ داده است.",
      code: 500,
      success: null,
    };
  }
}