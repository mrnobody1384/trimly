"use client";
import Image from "next/image";
import {
  BellDot,
  CalendarHeartIcon,
  LogIn,
  MapPin,
  SearchIcon,
  SettingsIcon,
  User,
} from "lucide-react";
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSalons,
  getUserInfo,
  getAllService,
  searchSalons,
  getSalonsByLocation,
} from "@/lib/api";
import SalonList from "@/components/slideCard";
import LoadingGif from "@/components/loadingGif";
import { SalonProfile } from "@/lib/types/employee";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [salons, setSalons] = useState<SalonProfile[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("همه");
  const [services, setServices] = useState(["همه"]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    image_profile: "",
    name: "",
  });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    }
  }, []);

  useEffect(() => {
    const determineGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "صبحت بخیر";
      if (hour >= 12 && hour < 17) return "ظهرت بخیر";
      if (hour >= 17 && hour < 21) return "عصرت بخیر";
      return "شبت بخیر";
    };

    setGreeting(determineGreeting());

    (async () => {
      setLoading(true);
      const userResponse = await getUserInfo();
      const salonsResponse = await getAllSalons();
      const servicesResponse = await getAllService();

      if (userResponse.success) setUser(userResponse.data);
      if (salonsResponse.success) {
        setSalons(salonsResponse.data);
        setFilteredSalons(salonsResponse.data);
      }
      if (servicesResponse.success) {
        const ss = servicesResponse.data.map((service: any) => service.name);
        setServices(["همه", ...ss]);
      }
      setLoading(false);
    })();
  }, []);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLoading(true);
      const response = await searchSalons(searchTerm);
      if (response.success) {
        setFilteredSalons(response.data);
      }
      setLoading(false);
    }
  };

  const handleNearbySalons = async () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await getSalonsByLocation(latitude, longitude);
        if (response.success) {
          setFilteredSalons(response.data);
        }
        setLoading(false);
      });
    } else {
      alert("مرورگر شما از موقعیت جغرافیایی پشتیبانی نمی‌کند.");
    }
  };

  const filterSalonsByService = () => {
    let result = salons;
    if (selectedService !== "همه") {
      result = salons.filter((salon: SalonProfile) =>
        salon.services?.includes(selectedService)
      );
    }
    setFilteredSalons(result);
  };

  useEffect(filterSalonsByService, [selectedService]);

  return (
    <div className="flex flex-col gap-3">
      {token ? (
        <div className="flex justify-between items-center">
          <div id="userInfo" className="flex justify-start items-center gap-3">
            <div className="rounded-full p-2 border bg-white">
              {user.image_profile ? (
                <Image
                  src={"http://127.0.0.1:8000" + user.image_profile}
                  width={50}
                  height={50}
                  alt={`${user.first_name} ${user.last_name}`}
                />
              ) : (
                <User width={40} height={40} />
              )}
            </div>

            <div>
              {role == "SALON" ? (
                <p>سلام {user.name}</p>
              ) : (
                <p>سلام {`${user.first_name} ${user.last_name}`}</p>
              )}
              <h2>{greeting}</h2>
            </div>
          </div>
          <Button
            id="notifications"
            className="rounded-full p-2 bg-white"
            onClick={() => router.push("/profile")}
          >
            <BellDot />
          </Button>
        </div>
      ) : null}

      <nav className="flex justify-between gap-2">
        <div className="gap-1 flex">
          {token && (
            <button
              id="setting"
              className="rounded-full p-2 bg-white "
              onClick={() => router.push("/profile")}
            >
              <SettingsIcon />
            </button>
          )}

          {!token && (
            <button id="calender" className="rounded-full p-2 bg-white">
              <LogIn />
            </button>
          )}
        </div>
        <TextInput
          id="search"
          placeholder="جستجو ..."
          className="w-full rounded-lg"
          leftSection={<SearchIcon />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </nav>

      <div className="flex gap-3 overflow-x-scroll">
        {services.map((service, index) => (
          <button
            key={index}
            className={`rounded-2xl w-fit p-2 ${
              selectedService === service ? "bg-myellow text-white" : ""
            }`}
            onClick={() => setSelectedService(service)}
          >
            {service}
          </button>
        ))}
      </div>

      <Button onClick={handleNearbySalons} className="w-3/4" variant="gradient">
        نمایش اطراف من <MapPin />
      </Button>

      {loading ? (
        <LoadingGif />
      ) : (
        <div className="flex flex-col">
          <p>انتخاب سالن</p>
          <SalonList salons={filteredSalons} />
        </div>
      )}
    </div>
  );
}
