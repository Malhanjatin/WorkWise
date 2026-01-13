import React, { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdmindataChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUserPerMonth = async () => {
      const res = await fetch(
           "https://workwisebackend.onrender.com/api/admin/user-per-month",
        { credentials: "include" }
      );

      const data = await res.json();

      const labels = data.map((item) => monthNames[item._id - 1]);
      const values = data.map((item) => item.totalUsers);
      setChartData({
        labels,
        datasets: [
          {
            label: "Registered Users",
            data: values,
          },
          
        ],
      });
    };
    fetchUserPerMonth();
  }, []);

  if (!chartData) return <p>Loading Graph.....</p>;
  return  <Bar data= {chartData}/>

};

export default AdmindataChart;
