import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

interface UserStats {
  name: string;
  taskCount: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

interface UserTaskDistributionProps {
  userStats: UserStats[];
}

export const UserTaskDistribution = ({
  userStats,
}: UserTaskDistributionProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Prepare data for the bar chart
    const data = {
      labels: userStats.map((user) => user.name),
      datasets: [
        {
          label: "Completed",
          backgroundColor: "#22C55E",
          data: userStats.map((user) => user.completedTasks),
          borderRadius: 6,
        },
        {
          label: "In Progress",
          backgroundColor: "#3B82F6",
          data: userStats.map((user) => user.inProgressTasks),
          borderRadius: 6,
        },
        {
          label: "Pending",
          backgroundColor: "#F59E0B",
          data: userStats.map((user) => user.pendingTasks),
          borderRadius: 6,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            font: {
              weight: "bold",
            },
          },
          position: "top",
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItems: any) => {
              const dataIndex = tooltipItems[0].dataIndex;
              const user = userStats[dataIndex];
              const total = user.taskCount;
              const completion = Math.round(
                (user.completedTasks / total) * 100
              );
              return [
                `Total Tasks: ${total}`,
                `Completion Rate: ${completion}%`,
              ];
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              weight: "bold",
            },
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            borderDash: [2, 4],
          },
          ticks: {
            stepSize: 1,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [userStats]);

  const getCompletionRate = (completed: number, total: number) => {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const getStatusSeverity = (completionRate: number) => {
    if (completionRate >= 75) return "success";
    if (completionRate >= 50) return "warning";
    return "danger";
  };

  return (
    <div className="col-12 lg:col-6">
      <Card
        title="User Task Distribution"
        className="mb-0"
        subTitle={`Task distribution across ${userStats.length} user${
          userStats.length !== 1 ? "s" : ""
        }`}
      >
        <div style={{ height: "400px" }}>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
};
