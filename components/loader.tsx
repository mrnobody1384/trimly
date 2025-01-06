"use client";
import { Loader } from "@mantine/core"; // یا هر Loader دیگر
import { useLoading } from "./LoadingContext";

export default function LoadingSpinner() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <Loader size="xl" color="white" />
    </div>
  );
}
