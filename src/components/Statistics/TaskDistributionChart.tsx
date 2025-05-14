import { Card } from "primereact/card";
import { Chart } from "primereact/chart";

interface TaskDistributionChartProps {
  chartData: any;
  chartOptions: any;
}

export const TaskDistributionChart = ({
  chartData,
  chartOptions,
}: TaskDistributionChartProps) => {
  return (
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
  );
};
