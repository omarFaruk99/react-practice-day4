import { Button } from "primereact/button";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (task: Task) => void;
}

type ButtonSeverity =
  | "warning"
  | "success"
  | "info"
  | "secondary"
  | "danger"
  | "help";

interface StatusButtonProps {
  icon: string;
  severity: ButtonSeverity;
  tooltip: string;
}

export const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onStatusToggle,
}: TaskItemProps) => {
  const { currentUser, isAdmin } = useAuth();

  // Check if the user can delete this task
  const canDelete = isAdmin() || task.assignedTo === currentUser?.id;

  const getStatusButtonProps = (status: string): StatusButtonProps => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          icon: "pi pi-refresh",
          severity: "warning",
          tooltip: "Mark as Pending",
        };
      case "pending":
        return {
          icon: "pi pi-check",
          severity: "success",
          tooltip: "Mark as Completed",
        };
      case "in-progress":
        return {
          icon: "pi pi-check",
          severity: "info",
          tooltip: "Mark as Completed",
        };
      default:
        return {
          icon: "pi pi-check",
          severity: "secondary",
          tooltip: "Update Status",
        };
    }
  };

  const buttonProps = getStatusButtonProps(task.status);

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => onEdit(task)}
        tooltip="Edit Task"
      />
      {canDelete && (
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => onDelete(task.id)}
          tooltip="Delete Task"
        />
      )}
      <Button
        icon={buttonProps.icon}
        rounded
        text
        severity={buttonProps.severity}
        onClick={() => onStatusToggle(task)}
        tooltip={buttonProps.tooltip}
      />
    </div>
  );
};
