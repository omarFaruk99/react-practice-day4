import { Card } from "primereact/card";

interface UserStats {
  name: string;
  taskCount: number;
}

interface UserTaskDistributionProps {
  userStats: UserStats[];
}

export const UserTaskDistribution = ({
  userStats,
}: UserTaskDistributionProps) => {
  return (
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
  );
};
