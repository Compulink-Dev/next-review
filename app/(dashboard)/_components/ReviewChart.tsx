import { FC } from "react";
import { Line } from "react-chartjs-2";

interface ReviewChartProps {
  data: { date: string; count: number }[];
}

const ReviewChart: FC<ReviewChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Reviews",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full">
      <p className="text-2xl font-bold mb-4">Review Growth Over Time</p>
      <Line data={chartData} />
    </div>
  );
};

export default ReviewChart;
