"use client";
import React, { useState, useEffect } from "react";
import { Table, Input, Button, Loader } from "@mantine/core";
import axios from "axios";
import { getSalonAppointments } from "@/lib/api";

interface Reservation {
  id: string;
  date: string;
  service: string;
  expert: string;
}

const UserReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getSalonAppointments()
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter((reservation) => {
    const today = new Date().toISOString().split("T")[0];
    const isUpcoming = reservation.date >= today;
    return (
      reservation.service.includes(searchTerm) &&
      (filterType === "all" ||
        (filterType === "upcoming" && isUpcoming) ||
        (filterType === "past" && !isUpcoming))
    );
  });

  return (
    <div>
      <h2>رزروهای شما</h2>
      <Input
        placeholder="جستجو بر اساس خدمت"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex gap-2 my-2">
        <Button onClick={() => setFilterType("all")}>همه</Button>
        <Button onClick={() => setFilterType("upcoming")}>رزروهای آینده</Button>
        <Button onClick={() => setFilterType("past")}>رزروهای گذشته</Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>تاریخ</th>
              <th>خدمت</th>
              <th>متخصص</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id}>
                <td>{res.date}</td>
                <td>{res.service}</td>
                <td>{res.expert}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserReservations;
