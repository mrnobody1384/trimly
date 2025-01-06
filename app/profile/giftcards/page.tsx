"use client";
import GiftcardForm from "@/components/giftcardForm";
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
import { CircleCheckBig, XCircleIcon } from "lucide-react";
import React from "react";

function Page() {
  const [opened, { close, open }] = useDisclosure(false);

  async function handleSubmit(res: any) {
    if (res.success) {
      notifications.show({
        message: res.success,
        title: "موفق",
        position: "top-center",
        color: "green",
        icon: <CircleCheckBig />,
        autoClose: 2000,
        onClose(props) {
          close();
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

  return (
    <div>

        <Button onClick={open}>اضافه کردن</Button>
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
            <Modal.Title>اضافه کردن کد تخفیف</Modal.Title>
          </ModalHeader>
          <ModalBody>
            <GiftcardForm onSubmit={handleSubmit} close={close} />
          </ModalBody>
        </ModalContent>
      </Modal.Root>
    </div>
  );
}

export default Page;
