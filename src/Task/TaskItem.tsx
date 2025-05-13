import { Button } from "primereact/button";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (task: Task) => void;
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

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => onEdit(task)}
      />
      {canDelete && (
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => onDelete(task.id)}
        />
      )}
      <Button
        icon={`pi pi-${task.status === "completed" ? "refresh" : "check"}`}
        rounded
        text
        severity={task.status === "completed" ? "warning" : "success"}
        onClick={() => onStatusToggle(task)}
      />
    </div>
  );
};
