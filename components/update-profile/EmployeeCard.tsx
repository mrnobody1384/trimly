"use client";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  ActionIcon,
} from "@mantine/core";
import { Pencil, Trash } from "lucide-react";
import { Employee } from "@/lib/types/employee";
import { parseTime, toTime } from "@internationalized/date";
interface EmployeeCardProps {
  employee: any;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={employee.user_image_profile}
          height={160}
          alt={`${employee.user_first_name} ${employee.user_last_name}`}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size="lg">
          {employee.user_first_name} {employee.user_last_name}
        </Text>
        <Group>
          <ActionIcon variant="subtle" onClick={() => onEdit(employee)}>
            <Pencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(employee?.id || "")}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <Group gap={7} mt={5}>
        {employee?.services?.map((skill: string) => (
          <Badge key={skill} variant="light" color="yellow">
            {skill}
          </Badge>
        ))}
      </Group>

      {/* <Text size="sm" c="dimmed" mt="md">
        ساعات کاری: {employee.shifts.start?.toString()} -{" "}
        {employee.shifts.end.toString()}
      </Text>

      <Text size="sm" c="dimmed">
        روزهای کاری: {employee.shifts.days.join("، ")}
      </Text> */}
    </Card>
  );
}
