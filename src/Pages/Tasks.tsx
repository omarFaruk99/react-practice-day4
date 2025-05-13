import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useTaskContext } from "../GlobalProvider/TaskContext";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { TaskForm } from "../Task/TaskForm";
import { TaskList } from "../Task/TaskList";
import { Task, TaskFormState } from "../Task/types";

const Tasks = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getMyTasks,
    getAllTasks,
  } = useTaskContext();
  const { currentUser, isAdmin } = useAuth();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<TaskFormState>({
    title: "",
    status: "pending",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const toast = useRef<Toast>(null);

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      status: task.status,
      description: task.description || "",
      assignedTo: task.assignedTo,
    });
    setEditTaskId(task.id);
    setEditMode(true);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    toast.current?.show({
      severity: "success",
      summary: "Task Deleted",
      detail: "Task has been deleted successfully",
      life: 3000,
    });
  };

  const handleStatusToggle = (task: Task) => {
    toggleTaskStatus(task);
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

    if (!formData.assignedTo) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a user to assign the task",
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateTask()) return;

    const taskData = {
      ...formData,
      description: formData.description || "",
      assignedTo: formData.assignedTo || 0,
    };

    if (editMode && editTaskId) {
      updateTask({
        id: editTaskId,
        ...taskData,
        createdAt: new Date(),
        createdBy: currentUser?.id || 0,
      });
      toast.current?.show({
        severity: "success",
        summary: "Task Updated",
        detail: "Task has been updated successfully",
        life: 3000,
      });
    } else {
      addTask(taskData);
      toast.current?.show({
        severity: "success",
        summary: "Task Added",
        detail: "New task has been added successfully",
        life: 3000,
      });
    }

    setVisible(false);
    setFormData({ title: "", status: "pending", description: "" });
    setEditMode(false);
    setEditTaskId(null);
  };

  if (!currentUser) {
    return (
      <Card>
        <div className="flex align-items-center justify-content-center">
          <h2>Please log in to view tasks</h2>
        </div>
      </Card>
    );
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Task Management</h1>
        {isAdmin() && (
          <Button
            label="Create Task"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
            severity="success"
          />
        )}
      </div>

      <TabView>
        <TabPanel header="My Tasks">
          <Card>
            <TaskList
              tasks={getMyTasks()}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          </Card>
        </TabPanel>
        {isAdmin() && (
          <TabPanel header="All Tasks">
            <Card>
              <TaskList
                tasks={getAllTasks()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            </Card>
          </TabPanel>
        )}
      </TabView>

      <TaskForm
        visible={visible}
        onHide={() => {
          setVisible(false);
          setFormData({ title: "", status: "pending", description: "" });
          setEditMode(false);
          setEditTaskId(null);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={(data: TaskFormState) => setFormData(data)}
        isEditMode={editMode}
      />
    </div>
  );
};

export default Tasks;
