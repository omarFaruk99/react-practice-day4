import { Card } from "primereact/card";

interface StatCardsProps {
  taskStats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
}

export const StatCards = ({ taskStats }: StatCardsProps) => {
  return (
    <>
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
    </>
  );
};
