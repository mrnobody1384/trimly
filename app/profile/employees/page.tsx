"use client";
import { EmployeeCard } from "@/components/update-profile/EmployeeCard";
import { EmployeeForm } from "@/components/update-profile/EmployeeForm";
import { SalonProfileEdit } from "@/components/update-profile/SalonProfileEdit";
import useUserRole from "@/lib/hooks/useUserRole";
import { Employee } from "@/lib/types/employee";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import {
  ArrowRight,
  ArrowRightCircle,
  CircleCheckBig,
  User,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useLoading } from "@/components/LoadingContext";
import { service } from "@/lib/types/service";
import { getAllService, getEmployees } from "@/lib/api";
import { Time } from "@internationalized/date";
function page() {
  const { setLoading } = useLoading();
  const role = useUserRole();
  const [opened, { close, open }] = useDisclosure(false);
  const [emploees, setEmployees] = useState<Employee[] | null>([]);
  const router = useRouter();
  console.log(role);

  const [services, setServices] = useState<service[] | null>([]);

  useEffect(() => {
    (async () => {
      const s = await getAllService();
      const e = await getEmployees();
      if (s.success) {
        setServices(s.data);
        console.log(s.data);
      }
      if (e.success) {
        setEmployees(e.data);
        console.log(e.data);
      }
    })();
  }, []);

  function handleSubmit(res: any, type: string) {
    console.log("HAHA");

    if (res.success) {
      notifications.show({
        message: res.success,
        title: "موفق",
        position: "top-center",
        color: "green",
        icon: <CircleCheckBig />,
        autoClose: 2000,
        onClose(props) {
          if (type == "ac") {
            close();
          }
        },
      });
    } else {
      notifications.show({
        message: res.error,
        title: "خطا",
        position: "top-center",
        color: "red",
        icon: <XCircleIcon />,
      });
    }
  }

  function handleSave() {
    console.log("Saved");
  }

  setLoading(false);
  return (
    <div className="flex justify-center items-center flex-col relative p-1">
      {role == "SALON" ? (
        <>
          {emploees!.length > 0 ? (
            <div className="pt-12">
              <Button onClick={open} className="!fixed left-5 top-5 z-10">
                اضافه کردن کارمند
              </Button>

              {emploees &&
                emploees?.map((emploee, index) => (
                  <EmployeeCard
                    key={index}
                    employee={emploee}
                    onDelete={(id) => {
                      console.log(id);
                    }}
                    onEdit={() => console.log(1)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-5">
              <p>هنوز کارمندی ندارید.</p>
              <Button onClick={open}>اضافه کردن کارمند</Button>
            </div>
          )}

          <Modal.Root
            opened={opened}
            onClose={close}
            classNames={{
              root: "!h-fit",
              content: "!h-fit",
              inner: "!h-fit",
              body: "!h-fit",
              header: "!flex !justify-between !flex-row-reverse",
              overlay: "h-fit",
            }}
            size={"sm"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Modal.CloseButton></Modal.CloseButton>
                <Modal.Title>اضافه کردن کارمند</Modal.Title>
              </ModalHeader>
              <ModalBody>
                <EmployeeForm onSubmit={handleSubmit} services={services} />
              </ModalBody>
            </ModalContent>
          </Modal.Root>
        </>
      ) : null}
    </div>
  );
}

export default page;
