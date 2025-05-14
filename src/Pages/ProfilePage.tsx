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
    <div className="flex flex-column align-items-center py-5 px-3">
      <Card className="w-full md:w-8 lg:w-6 mb-4">
        <div className="flex flex-column md:flex-row align-items-center gap-4 p-4">
          <Avatar
            icon="pi pi-user"
            size="xlarge"
            shape="circle"
            className="w-6rem h-6rem"
            style={{
              backgroundColor: "var(--primary-color)",
              color: "#ffffff",
            }}
          />
          <div className="flex flex-column gap-2">
            <h2 className="text-2xl font-bold m-0">{userProfile.name}</h2>
            <p className="text-500 m-0">
              <i className="pi pi-envelope mr-2"></i>
              {userProfile.email}
            </p>
            <p className="text-500 m-0">
              <i className="pi pi-id-card mr-2"></i>
              ID: {userProfile.id}
            </p>
          </div>
        </div>
      </Card>

      <Card className="w-full md:w-8 lg:w-6">
        <div className="grid">
          <div className="col-12">
            <h2 className="text-xl font-medium text-900 mb-4">Task Overview</h2>
          </div>
          <div className="col-12 md:col-3">
            <div
              className="border-round-xl p-4 h-full shadow-1"
              style={{
                background:
                  "linear-gradient(to right bottom, #4F46E5, #7C3AED)",
              }}
            >
              <div className="mb-3">
                <i className="pi pi-inbox text-white text-xl"></i>
              </div>
              <div className="text-white font-medium mb-2">Total Tasks</div>
              <div className="text-white text-4xl font-bold">
                {taskStats.total}
              </div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div
              className="border-round-xl p-4 h-full shadow-1"
              style={{
                background:
                  "linear-gradient(to right bottom, #059669, #10B981)",
              }}
            >
              <div className="mb-3">
                <i className="pi pi-check-circle text-white text-xl"></i>
              </div>
              <div className="text-white font-medium mb-2">Completed</div>
              <div className="text-white text-4xl font-bold">
                {taskStats.completed}
              </div>
              <div className="text-white-alpha-70 mt-2">
                {Math.round((taskStats.completed / taskStats.total) * 100) || 0}
                % completion rate
              </div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div
              className="border-round-xl p-4 h-full shadow-1"
              style={{
                background:
                  "linear-gradient(to right bottom, #F59E0B, #FCD34D)",
              }}
            >
              <div className="mb-3">
                <i className="pi pi-clock text-white text-xl"></i>
              </div>
              <div className="text-white font-medium mb-2">Pending</div>
              <div className="text-white text-4xl font-bold">
                {taskStats.pending}
              </div>
              <div className="text-white-alpha-70 mt-2">Awaiting action</div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div
              className="border-round-xl p-4 h-full shadow-1"
              style={{
                background:
                  "linear-gradient(to right bottom, #3B82F6, #60A5FA)",
              }}
            >
              <div className="mb-3">
                <i className="pi pi-sync text-white text-xl"></i>
              </div>
              <div className="text-white font-medium mb-2">In Progress</div>
              <div className="text-white text-4xl font-bold">
                {taskStats.inProgress}
              </div>
              <div className="text-white-alpha-70 mt-2">Currently working</div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <div className="border-round-xl p-4 surface-ground">
              <h3 className="text-xl font-medium text-900 mb-4">
                Task Distribution
              </h3>
              <div style={{ height: "400px" }}>
                <Chart type="pie" data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
