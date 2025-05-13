import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../GlobalProvider/TaskContext";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import { TaskList } from "../Task/TaskList";
import { Task, TaskFormState } from "../Task/types";

const Home = () => {
  const { currentUser, isAdmin } = useAuth();
  const { getMyTasks, deleteTask, updateTask, toggleTaskStatus, getAllTasks } =
    useTaskContext();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TaskFormState>({
    title: "",
    status: "pending",
    description: "",
  });

  // Stats state
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [userStats, setUserStats] = useState<
    { name: string; taskCount: number }[]
  >([]);

  useEffect(() => {
    if (isAdmin()) {
      const allTasks = getAllTasks();
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Calculate task statistics
      const stats = {
        total: allTasks.length,
        completed: allTasks.filter((t) => t.status === "completed").length,
        pending: allTasks.filter((t) => t.status === "pending").length,
        inProgress: allTasks.filter((t) => t.status === "in-progress").length,
      };
      setTaskStats(stats);

      // Calculate user statistics
      const userTaskCounts = users
        .filter((user: any) => user.role !== "admin")
        .map((user: any) => ({
          name: user.name,
          taskCount: allTasks.filter((t) => t.assignedTo === user.id).length,
        }))
        .sort((a: any, b: any) => b.taskCount - a.taskCount);
      setUserStats(userTaskCounts);

      // Prepare chart data
      const data = {
        labels: ["Completed", "Pending", "In Progress"],
        datasets: [
          {
            data: [stats.completed, stats.pending, stats.inProgress],
            backgroundColor: ["#22C55E", "#F59E0B", "#3B82F6"],
            hoverBackgroundColor: ["#16A34A", "#D97706", "#2563EB"],
          },
        ],
      };

      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [isAdmin, getAllTasks]);

  const handleEdit = (task: Task) => {
    if (isAdmin()) {
      navigate("/tasks");
    } else {
      setFormData({
        title: task.title,
        status: task.status,
        description: task.description || "",
        assignedTo: task.assignedTo,
      });
      setEditTaskId(task.id);
      setEditMode(true);
      setVisible(true);
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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Task title is required",
        life: 3000,
      });
      return;
    }

    if (editMode && editTaskId) {
      const originalTask = getMyTasks().find((task) => task.id === editTaskId);
      if (!originalTask) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Task not found",
          life: 3000,
        });
        return;
      }

      updateTask({
        id: editTaskId,
        ...formData,
        createdAt: new Date(),
        createdBy: currentUser?.id || 0,
        assignedTo: originalTask.assignedTo,
        description: formData.description || "",
      });
      toast.current?.show({
        severity: "success",
        summary: "Task Updated",
        detail: "Task has been updated successfully",
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

      {isAdmin() ? (
        <div className="grid">
          {/* Statistics Cards */}
          <div className="col-12 lg:col-6 xl:col-3">
            <Card className="mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Total Tasks
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {taskStats.total}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-inbox text-blue-500 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6 xl:col-3">
            <Card className="mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Completed Tasks
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {taskStats.completed}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-check-circle text-green-500 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6 xl:col-3">
            <Card className="mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Pending Tasks
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {taskStats.pending}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-orange-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-clock text-orange-500 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6 xl:col-3">
            <Card className="mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    In Progress
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {taskStats.inProgress}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-sync text-cyan-500 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts and User Stats */}
          <div className="col-12 lg:col-6">
            <Card title="Task Distribution" className="mb-0">
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-full md:w-30rem"
              />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card title="User Task Distribution" className="mb-0">
              <div className="flex flex-column">
                {userStats.map((user, index) => (
                  <div
                    key={index}
                    className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border"
                  >
                    <span className="text-900 font-medium">{user.name}</span>
                    <span className="text-700">{user.taskCount} tasks</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Tasks */}
          <div className="col-12">
            <Card>
              <div className="flex justify-content-between align-items-center mb-3">
                <h2 className="m-0 text-xl">Recent Tasks</h2>
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
        </div>
      ) : (
        <Card>
          <div className="flex justify-content-between align-items-center mb-3">
            <h2 className="m-0 text-xl">My Tasks</h2>
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
      )}

      <Dialog
        visible={visible}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={editMode ? "Edit Task" : "Create Task"}
        modal
        className="p-fluid"
        onHide={() => {
          setVisible(false);
          setFormData({ title: "", status: "pending", description: "" });
          setEditMode(false);
          setEditTaskId(null);
        }}
      >
        <div className="field">
          <label htmlFor="title" className="font-bold">
            Title
          </label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            cols={20}
          />
        </div>
        <div className="field">
          <label htmlFor="status" className="font-bold">
            Status
          </label>
          <Dropdown
            id="status"
            value={formData.status}
            options={[
              { label: "Pending", value: "pending" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ]}
            onChange={(e) => setFormData({ ...formData, status: e.value })}
            placeholder="Select a Status"
          />
        </div>
        <div className="flex justify-content-end mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => {
              setVisible(false);
              setFormData({ title: "", status: "pending", description: "" });
              setEditMode(false);
              setEditTaskId(null);
            }}
            className="mr-2"
          />
          <Button
            label={editMode ? "Update" : "Create"}
            icon="pi pi-check"
            onClick={handleSubmit}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Home;
