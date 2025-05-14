import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../GlobalProvider/TaskContext";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const navigate = useNavigate();
  const { getAssignedTasks } = useTaskContext();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUserProfile(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (userProfile) {
      const tasks = getAssignedTasks();

      // Calculate task statistics
      const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === "completed").length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
      };
      setTaskStats(stats);

      // Prepare chart data
      const data = {
        labels: ["Completed", "Pending", "In Progress"],
        datasets: [
          {
            data: [stats.completed, stats.pending, stats.inProgress],
            backgroundColor: ["#10B981", "#F59E0B", "#3B82F6"],
            hoverBackgroundColor: ["#059669", "#D97706", "#2563EB"],
            borderWidth: 0,
          },
        ],
      };

      const options = {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              font: {
                weight: 600,
              },
              padding: 20,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [userProfile, getAssignedTasks]);

  if (!userProfile) {
    return null;
  }

  return (
    <div className="flex flex-column align-items-center py-4 px-3">
      <div className="grid w-full md:w-11 lg:w-9 xl:w-8 m-0">
        {/* Profile Card Column */}
        <div className="col-12 md:col-4 p-2">
          <Card className="h-full">
            <div className="flex flex-column align-items-center text-center">
              <div className="relative">
                <Avatar
                  icon="pi pi-user"
                  size="xlarge"
                  shape="circle"
                  className="w-8rem h-8rem shadow-4"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "#ffffff",
                  }}
                />
                <div
                  className="absolute"
                  style={{ bottom: "0.5rem", right: "0.5rem" }}
                >
                  <i className="pi pi-circle-fill text-green-500 text-xl"></i>
                </div>
              </div>
              <div className="mt-3 surface-50 border-round-2xl p-3 w-full">
                <h2 className="text-2xl font-bold m-0 mb-2">
                  {userProfile.name}
                </h2>
                <p className="text-600 m-0 mb-2">
                  <i className="pi pi-envelope mr-2"></i>
                  {userProfile.email}
                </p>
                <p className="text-600 m-0">
                  <i className="pi pi-id-card mr-2"></i>
                  ID: {userProfile.id}
                </p>
              </div>
              <div className="mt-3 text-500 text-sm">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </Card>
        </div>

        {/* Task Statistics Column */}
        <div className="col-12 md:col-8 p-2">
          <Card>
            <div className="grid">
              <div className="col-12 pb-0">
                <div className="flex justify-content-between align-items-center mb-3">
                  <h2 className="text-xl font-medium text-900 m-0">
                    Task Overview
                  </h2>
                  <span className="p-badge p-component p-badge-info">
                    {taskStats.total} Total Tasks
                  </span>
                </div>
              </div>

              {/* Compact Statistics Cards */}
              <div className="col-6 lg:col-3 p-2">
                <div className="surface-card border-round-xl p-3 h-full shadow-1">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <i className="pi pi-inbox text-primary text-2xl"></i>
                    <span className="text-primary font-medium">Total</span>
                  </div>
                  <div className="text-900 text-3xl font-bold">
                    {taskStats.total}
                  </div>
                </div>
              </div>

              <div className="col-6 lg:col-3 p-2">
                <div className="surface-card border-round-xl p-3 h-full shadow-1">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <i className="pi pi-check-circle text-green-600 text-2xl"></i>
                    <span className="text-green-600 font-medium">Done</span>
                  </div>
                  <div className="text-900 text-3xl font-bold">
                    {taskStats.completed}
                  </div>
                  <div className="text-500 mt-2 text-sm">
                    {Math.round(
                      (taskStats.completed / taskStats.total) * 100
                    ) || 0}
                    % rate
                  </div>
                </div>
              </div>

              <div className="col-6 lg:col-3 p-2">
                <div className="surface-card border-round-xl p-3 h-full shadow-1">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <i className="pi pi-clock text-orange-600 text-2xl"></i>
                    <span className="text-orange-600 font-medium">Pending</span>
                  </div>
                  <div className="text-900 text-3xl font-bold">
                    {taskStats.pending}
                  </div>
                  <div className="text-500 mt-2 text-sm">Awaiting action</div>
                </div>
              </div>

              <div className="col-6 lg:col-3 p-2">
                <div className="surface-card border-round-xl p-3 h-full shadow-1">
                  <div className="flex align-items-center justify-content-between mb-3">
                    <i className="pi pi-sync text-blue-600 text-2xl"></i>
                    <span className="text-blue-600 font-medium">Active</span>
                  </div>
                  <div className="text-900 text-3xl font-bold">
                    {taskStats.inProgress}
                  </div>
                  <div className="text-500 mt-2 text-sm">In progress</div>
                </div>
              </div>

              {/* Task Distribution Chart */}
              <div className="col-12 mt-3">
                <div className="surface-section border-round-xl p-4">
                  <h3 className="text-lg font-medium text-900 mb-3">
                    Task Distribution
                  </h3>
                  <div style={{ height: "300px" }}>
                    <Chart type="pie" data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
