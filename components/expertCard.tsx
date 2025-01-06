"use client";
import { Employee } from "@/lib/types/employee";
import Image from "next/image";
import React from "react";

interface Props {
  expert: {
    id: string;
    first_name: string;
    last_name: string;
    image_profile: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ExpertCard({ expert, isSelected, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect(expert?.id as string)}
      className={`cursor-pointer p-2 border-2 rounded-lg transition-all flex flex-col justify-center items-center ${
        isSelected ? "border-blue-500 bg-myellow" : "border-gray-200"
      }`}
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        <Image
          src={"http://127.0.0.1:8000/" + expert.image_profile}
          alt={expert.first_name}
          fill
        />
      </div>
      <p className="text-xl mt-2">{`${expert.first_name} ${expert.last_name}`}</p>
    </div>
  );
}
