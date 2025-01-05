"use client";
import { readLocalStorageValue } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React from "react";

function Layout(props: any) {
  const token: string | undefined = readLocalStorageValue({ key: "token" });
  const router = useRouter();
  if (token) router.replace("/");
  return <div>{props.children}</div>;
}

export default Layout;
