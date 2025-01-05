"use client";

import { SalonProfile } from "@/lib/types/employee";
import { User } from "lucide-react";
import Image from "next/image";
import React from "react";

function SalonHeader({ salon }: { salon: SalonProfile }) {
  console.log(salon);
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        id="imgContainer"
        className="rounded-[8px] w-64 h-36 0 p-2 border border-gray-400 relative overflow-hidden"
      >
        <Image
          src={
            salon.images[0]
              ? "http://127.0.0.1:8000/" + salon.images[0]
              : "/images.jfif"
          }
          alt="image"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <h2 className="text-2xl mt-1 font-bold">{salon.name}</h2>
      <h3>{salon.contact_number}</h3>
      <h3>{salon.location}</h3>
      <h4>{salon.description}</h4>
    </div>
  );
}

export default SalonHeader;
