import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../GlobalProvider/TaskContext";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { TaskList } from "../Task/TaskList";
import { Task } from "../Task/types";

const Home = () => {
  const { currentUser, isAdmin } = useAuth();
  const { getMyTasks, deleteTask, updateTask, toggleTaskStatus } =
    useTaskContext();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const handleEdit = (task: Task) => {
    // For admin, navigate to tasks page. For normal users, stay on home
    if (isAdmin()) {
      navigate("/tasks");
    }
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

  if (!currentUser) {
    return (
      <Card>
        <div className="flex flex-column align-items-center justify-content-center gap-3">
          <h2>Welcome to Task Management System</h2>
          <p>Please log in to view your tasks</p>
          <Button label="Login" onClick={() => navigate("/signin")} />
        </div>
      </Card>
    );
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Welcome, {currentUser.name}!</h1>
        {isAdmin() && (
          <div className="flex gap-2">
            <Button
              label="View All Tasks"
              icon="pi pi-list"
              onClick={() => navigate("/tasks")}
              severity="info"
            />
            <Button
              label="Create Task"
              icon="pi pi-plus"
              onClick={() => navigate("/tasks")}
              severity="success"
            />
          </div>
        )}
      </div>

      <Card>
        <div className="flex justify-content-between align-items-center mb-3">
          <h2 className="m-0 text-xl">
            {isAdmin() ? "My Created Tasks" : "My Tasks"}
          </h2>
          {getMyTasks().length > 0 && (
            <span className="text-500">
              Showing {getMyTasks().length} task(s)
            </span>
          )}
        </div>
        <TaskList
          tasks={getMyTasks()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
      </Card>
    </div>
  );
};

export default Home;
