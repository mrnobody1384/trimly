import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

import { MantineProvider } from "@mantine/core";
import { LoadingProvider } from "@/components/LoadingContext";
import LoadingSpinner from "@/components/loader";

export const metadata: Metadata = {
  title: "trimly",
  description: "جنتلمن باش",
};
const Vazirmatn = localFont({
  src: "./fonts/Vazirmatn[wght].woff2",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${Vazirmatn.className} bg-[#C2C2C2] p-5`}>
        <MantineProvider>
          <Notifications />
          <LoadingProvider>
            <LoadingSpinner />
            {children}
          </LoadingProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
