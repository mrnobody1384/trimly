"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [salons, setSalons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // بررسی نقش کاربر
  useEffect(() => {
    const token:string | null = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // if (!token || role !== "admin") {
    //   router.push("/login");
    // } else {
    //   fetchData(token);
    // }
    fetchData(token);

  }, [router]);

  // دریافت اطلاعات کاربران و سالن‌ها از بک‌اند Django
  const fetchData = async (token:string|null) => {
    try {
      const usersResponse = await axios.get(
        "http://localhost:8000/api/admin/users/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const salonsResponse = await axios.get(
        "http://localhost:8000/api/admin/salons/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(usersResponse.data);
      setSalons(salonsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("مشکلی در دریافت اطلاعات رخ داده است.");
      setLoading(false);
    }
  };

  // حذف کاربر
  const handleDeleteUser = async (userId:number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user:{id:number}) => user.id !== userId));
    } catch (err) {
      setError("خطا در حذف کاربر.");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">پنل مدیریت ادمین</h1>
      {error && <p className="text-red-500">{error}</p>}

      <section className="mb-8">
        <h2 className="text-xl mb-2">لیست کاربران</h2>
        <ul>
          {users.map((user:{id:number,name:string,email:string}) => (
            <li key={user.id} className="flex justify-between border-b p-2">
              <span>{user.name} - {user.email}</span>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl mb-2">لیست سالن‌ها</h2>
        <ul>
          {salons.map((salon:{id:number,name:string,location:string}) => (
            <li key={salon.id} className="flex justify-between border-b p-2">
              <span>{salon.name} - {salon.location}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
