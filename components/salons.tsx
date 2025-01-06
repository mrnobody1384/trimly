"use client";
import React from "react";
import SalonList from "./slideCard";

interface SalonConfig {
  name: string;
  services: string[];
}

function Salons(props: React.ComponentProps<any>) {
  const data: SalonConfig = props.data;
  return (
    <div className="flex flex-column">
      <p>انتخاب سالن</p>
      <SalonList/>
    </div>
  );
}

export default Salons;
