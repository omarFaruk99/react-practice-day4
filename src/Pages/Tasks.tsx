import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useTaskContext } from "../GlobalProvider/TaskContext";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { TaskForm } from "../Task/TaskForm";
import { TaskList } from "../Task/TaskList";
import { Task, TaskFormData } from "../Task/types";

const Tasks = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getMyTasks,
    getAssignedTasks,
    getAllTasks,
  } = useTaskContext();
  const { currentUser, isAdmin } = useAuth();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
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
      description: task.description,
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

    if (editMode && editTaskId) {
      updateTask({
        id: editTaskId,
        ...formData,
        createdAt: new Date(),
        createdBy: currentUser?.id || 0,
        assignedTo: formData.assignedTo || 0,
      });
      toast.current?.show({
        severity: "success",
        summary: "Task Updated",
        detail: "Task has been updated successfully",
        life: 3000,
      });
    } else {
      addTask({
        ...formData,
        assignedTo: formData.assignedTo || 0,
      });
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

  const handleHide = () => {
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
        <TabPanel header={isAdmin() ? "Created Tasks" : "My Tasks"}>
          <Card>
            <TaskList
              tasks={getMyTasks()}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          </Card>
        </TabPanel>
        {!isAdmin() && (
          <TabPanel header="Assigned to Me">
            <Card>
              <TaskList
                tasks={getAssignedTasks()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            </Card>
          </TabPanel>
        )}
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
        onHide={handleHide}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={setFormData}
        isEditMode={editMode}
      />
    </div>
  );
};

export default Tasks;
