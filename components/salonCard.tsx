import Image from "next/image";
import React from "react";

export default function SalonCard() {
  return (
    <div className="flex justify-between rounded-xl p-2">
      <div className="flex gap-3">
        {/* <Image /> */}
        <p></p>
        <div className="flex flex-col gap-1">
          <h2></h2>
          <p></p>
        </div>
      </div>
      <p>{"<"}</p>
    </div>
  );
}
