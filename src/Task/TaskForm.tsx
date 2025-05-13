import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { TaskFormData } from "./types";

interface TaskFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  formData: TaskFormData;
  onChange: (data: TaskFormData) => void;
  isEditMode: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const TaskForm = ({
  visible,
  onHide,
  onSubmit,
  formData,
  onChange,
  isEditMode,
}: TaskFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    // Load users from localStorage and filter out admin users
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      // Only show non-admin users in the dropdown
      const normalUsers = allUsers.filter(
        (user: User) => user.role !== "admin"
      );
      setUsers(normalUsers);
    }
  }, []);

  return (
    <Dialog
      header={isEditMode ? "Edit Task" : "Create Task"}
      visible={visible}
      onHide={onHide}
      modal
      className="p-fluid"
      style={{ width: "450px" }}
    >
      <div className="field">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          required
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={formData.status}
          options={["pending", "completed"]}
          onChange={(e) => onChange({ ...formData, status: e.value })}
          placeholder="Select a Status"
        />
      </div>

      <div className="field">
        <label htmlFor="assignedTo">Assign To</label>
        <Dropdown
          id="assignedTo"
          value={formData.assignedTo}
          options={users}
          onChange={(e) => onChange({ ...formData, assignedTo: e.value })}
          optionLabel="name"
          optionValue="id"
          placeholder="Select a User"
        />
      </div>

      <div className="flex justify-content-end">
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
        <Button label="Save" icon="pi pi-check" onClick={onSubmit} autoFocus />
      </div>
    </Dialog>
  );
};
