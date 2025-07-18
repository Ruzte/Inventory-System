import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sales-daily")
      .then(response => setSalesData(response.data))
      .catch(error => console.error("Error fetching sales data:", error));
  }, []);

  const data = {
    labels: salesData.map(sale => sale._id),
    datasets: [
      {
        label: "Total Sales (₱)",
        data: salesData.map(sale => sale.totalValue),
        fill: false,
        borderColor: "#89AE29",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₱${value}`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
