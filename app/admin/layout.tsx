"use client"
import { Button, Drawer } from "@mantine/core";
import { ReactElement } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: ReactElement }) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  // لیست مسیرهای ناوبری پنل ادمین
  const navLinks = [
    { name: "داشبورد", path: "/admin-panel" },
    { name: "مدیریت کاربران", path: "/admin-panel/users" },
    { name: "مدیریت سالن‌ها", path: "/admin-panel/salons" },
    { name: "گزارشات و بازدیدها", path: "/admin-panel/reports" },
    { name: "خروج", path: "/logout" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* هدر */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">پنل مدیریت</h1>
        <Button variant="default" onClick={open} className="lg:hidden">
          منو
        </Button>
      </header>

      {/* منوی جانبی برای موبایل */}
      <Drawer opened={opened} onClose={close} title="منوی ادمین" position="left">
        <nav className="flex flex-col gap-4">
          {navLinks.map((link, index) => (
            <Button
              key={index}
              variant="subtle"
              onClick={() => {
                router.push(link.path);
                close(); // بستن منو پس از کلیک
              }}
              fullWidth
              className="text-right"
            >
              {link.name}
            </Button>
          ))}
        </nav>
      </Drawer>

      {/* محتوای اصلی */}
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}
