import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const LineChart = ({ data, selectedFeature }) => {
  const trendData = data.map((entry) => ({
    x: entry.Day,
    y: parseInt(entry[selectedFeature], 10) || 0, // Use 0 for missing data
  }));

  const chartData = {
    labels: data.map((entry) => entry.Day),
    datasets: [
      {
        label: `Trend for Feature ${selectedFeature}`,
        data: trendData,
        borderColor: "#4BC0C0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Trend for Feature ${selectedFeature}`,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
