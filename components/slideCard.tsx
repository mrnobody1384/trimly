import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SalonCardProps {
  salon: {
    id?: string;
    name: string;
    salon_images: string[];
    location: string;
    services?: string[];
  };
}

const SalonCard = ({ salon }: SalonCardProps) => {
  return (
    <Link
      href={`/salons/${salon?.id}`}
      passHref
      className="bg-white rounded-2xl border border-b-4 border-myellow pl-2"
    >
      <div className="p-2 shadow-md flex items-center justify-between">
        <div className="flex gap-5 ">
          <div className="w-[150px] relative aspect-video border border-gray-400 rounded-2xl overflow-hidden">
            <Image
              src={"http://127.0.0.1:8000/" + salon.salon_images[0]}
              alt={salon.name}
              className="w-full h-40 object-cover rounded-md"
              fill
            />
          </div>
          <div>
            <h3 className="text-2xl">{salon.name}</h3>
            <p className="text-sm text-gray-600">{salon.location}</p>
            <p className="text-sm text-gray-600">
              {salon?.services
                ?.map((s: any) => s.name)
                .slice(0, 3)
                .join(", ")}
            </p>
          </div>
        </div>
        <div className="text-2xl">
          <ChevronLeft />
        </div>
      </div>
    </Link>
  );
};

interface SalonListProps {
  salons: SalonCardProps["salon"][];
}

const SalonList = ({ salons }: SalonListProps) => {
  console.log("in Salon list", salons);
  return (
    <div className="p-4 flex flex-col gap-4">
      {salons.map((salon, index) => (
        <SalonCard key={index} salon={salon} />
      ))}
    </div>
  );
};

export default SalonList;
