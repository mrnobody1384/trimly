"use client";
import { useEffect, useState } from "react";
import { Button, Modal, TextInput, Group, Stack } from "@mantine/core";
import ServiceForm from "@/components/services/servicesForm";
import { useLoading } from "@/components/LoadingContext";
import { createExpertise, getAllService } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { CircleCheckBig, Pen, Trash, XCircleIcon } from "lucide-react";
import { service } from "@/lib/types/service";

export default function Page() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<service | null>(null);
  const [services, setServices] = useState<service[] | null>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    (async () => {
      const res = await getAllService();
      if (res.success) {
        setServices(res.data);
      }
    })();
  }, []);
  const handleAddService = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentService(null);
  };

  const handleEditService = (service: service) => {
    setCurrentService(service);
    setIsEditModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(
      services!.filter((service) => (service.id as string) !== serviceId)
    );
  };

  const handleSaveService = async (newService: service) => {
    if (currentService) {
      // Update existing service
      // setServices(
      //   services!.map((service: service) =>
      //     service.id === currentService.id ? newService : service
      //   )
      // );
    } else {
      const res = await createExpertise(newService);
      if (res.success) {
        notifications.show({
          message: res.success,
          title: "موفق",
          position: "top-center",
          color: "green",
          icon: <CircleCheckBig />,
          autoClose: 2000,
          onClose(props) {
            handleCloseAddModal();
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
      // Add new service
      //   if (services) {
      //     setServices([...services, { ...newService, [id as string]: Date.now() }]);
      //   }
    }
    handleCloseAddModal();
    handleCloseEditModal();
  };
  setLoading(false);

  return (
    <div style={{ padding: "20px" }}>
      {/* دکمه افزودن خدمت */}
      <Button
        onClick={handleAddService}
        style={{ position: "absolute", top: 20, left: 15 }}
        variant="outline"
      >
        افزودن خدمت
      </Button>

      {/* نمایش لیست خدمات */}
      <div className="!mt-3">
        {services!.length > 0 ? (
          <Stack>
            {services!.map((service: service) => (
              <Group key={service.id}>
                <span className="text-md font-bold">
                  {service.name as string}
                </span>
                <div className="flex !gap-2">
                  <Button
                    onClick={() => handleEditService(service)}
                    variant="gradient"
                    size="md"
                    classNames={{
                      label: "!space-x-reverse !space-x-[1px]",
                      inner: "!p-1",
                      root: "!p-1",
                    }}
                  >
                    ویرایش
                    <Pen size={20} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteService(service.id as string)}
                    variant="filled"
                    size="md"
                    color="red"
                    classNames={{
                      label: "!space-x-reverse !space-x-[1px]",
                      inner: "!p-1",
                      root: "!p-1",
                    }}
                  >
                    حذف
                    <Trash size={20} />
                  </Button>
                </div>
              </Group>
            ))}
          </Stack>
        ) : (
          <p>هیچ خدمتی ثبت نشده است.</p>
        )}
      </div>

      {/* Modal برای افزودن خدمت */}
      <Modal
        opened={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="افزودن خدمت جدید"
      >
        <ServiceForm
          onSave={handleSaveService}
          onCancel={handleCloseAddModal}
        />
      </Modal>
    </div>
  );
}
