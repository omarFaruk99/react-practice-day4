import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { TaskForm } from "../Task/TaskForm";
import { TaskList } from "../Task/TaskList";
import { Task, TaskFormData } from "../Task/types";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    status: "pending",
  });
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const toast = useRef<Toast>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleEdit = (task: Task) => {
    setFormData({ title: task.title, status: task.status });
    setEditTaskId(task.id);
    setEditMode(true);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.current?.show({
      severity: "success",
      summary: "Task Deleted",
      detail: "Task has been deleted successfully",
      life: 3000,
    });
  };

  const handleStatusToggle = (task: Task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        const newStatus = t.status === "completed" ? "pending" : "completed";
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTasks(updatedTasks);
    toast.current?.show({
      severity: "success",
      summary: "Task Updated",
      detail: `Task marked as ${
        task.status === "completed" ? "pending" : "completed"
      }`,
      life: 3000,
    });
  };

  const validateTask = () => {
    if (!formData.title.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Task title is required",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateTask()) return;

    if (editMode && editTaskId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editTaskId
          ? { ...task, title: formData.title, status: formData.status }
          : task
      );
      setTasks(updatedTasks);
      toast.current?.show({
        severity: "success",
        summary: "Task Updated",
        detail: "Task has been updated successfully",
        life: 3000,
      });
    } else {
      const task: Task = {
        id: tasks.length + 1,
        title: formData.title,
        status: formData.status,
        createdAt: new Date(),
      };
      setTasks([...tasks, task]);
      toast.current?.show({
        severity: "success",
        summary: "Task Added",
        detail: "New task has been added successfully",
        life: 3000,
      });
    }

    handleDialogClose();
  };

  const handleDialogClose = () => {
    setVisible(false);
    setFormData({ title: "", status: "pending" });
    setEditMode(false);
    setEditTaskId(null);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card>
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Tasks</h2>
          <Button
            label="Add Task"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        </div>

        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
      </Card>

      <TaskForm
        visible={visible}
        onHide={handleDialogClose}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={setFormData}
        isEditMode={editMode}
      />

      <style>
        {`
          .status-badge {
            padding: 0.5rem;
            border-radius: 4px;
            text-transform: capitalize;
          }
          .status-pending {
            background-color: var(--yellow-100);
            color: var(--yellow-900);
          }
          .status-completed {
            background-color: var(--green-100);
            color: var(--green-900);
          }
          .p-column-filter {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default Tasks;
