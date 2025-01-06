import React from "react";

function FilterService() {
  const FilTER = ["ALL", "HairCuts", "Facial", "Hairdo", "Massage"];
  return (
    <div className="flex flex-row-reverse gap-3 overflow-x-scroll">
      {FilTER.map((f, index) => {
        return (
          <button className="rounded-2xl w-fit p-2" key={index}>
            {f}
          </button>
        );
      })}
    </div>
  );
}

export default FilterService;
