import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TaskFormData } from "./types";

interface TaskFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  formData: TaskFormData;
  onChange: (data: TaskFormData) => void;
  isEditMode: boolean;
}

export const TaskForm = ({
  visible,
  onHide,
  onSubmit,
  formData,
  onChange,
  isEditMode,
}: TaskFormProps) => {
  const statuses = ["pending", "completed"];

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={isEditMode ? "Edit Task" : "Add New Task"}
      modal
      className="p-fluid"
    >
      <div className="flex flex-column gap-3 pt-3">
        <div className="field">
          <label htmlFor="title">Title</label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <Dropdown
            id="status"
            value={formData.status}
            options={statuses}
            onChange={(e) => onChange({ ...formData, status: e.value })}
            placeholder="Select a Status"
          />
        </div>
        <Button label={isEditMode ? "Update" : "Add"} onClick={onSubmit} />
      </div>
    </Dialog>
  );
};
