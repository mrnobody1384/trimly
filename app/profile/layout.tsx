"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readLocalStorageValue } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { useLoading } from "@/components/LoadingContext";
import { ArrowRight } from "lucide-react";
import LoadingSpinner from "@/components/loader";

function Layout(props: any) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true); // Set loading state to true
    router.back(); // Navigate back
  };

  useEffect(() => {
    const token: string | undefined = readLocalStorageValue({ key: "token" });
    if (!token) router.replace("/auth");
  }, []);

  useEffect(() => {
    if (isLoading) {
      // After navigation is complete, turn off the loading state
      setTimeout(() => setIsLoading(false), 1000); // simulate delay for the spinner
    }
  }, [isLoading]);

  return (
    <div className="p-6">
      {isLoading ? <LoadingSpinner /> : null}{" "}
      {/* Show loading spinner when isLoading is true */}
      <Button
        onClick={() => handleNavigation()}
        className="!fixed right-5 top-5 z-10 !w-10 !h-10 !rounded-full !p-2 !bg-myellow"
      >
        <ArrowRight />
      </Button>
      {props.children}
    </div>
  );
}

export default Layout;
