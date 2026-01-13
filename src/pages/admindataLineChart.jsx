import {useState,useEffect} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend
}
from 'chart.js'
import {Line} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

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

 const AdminLineChart = ()=>{
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
            fill: false,
            tension: 0.4, // smooth curve
          },
        ],
      });
    };

    fetchUserPerMonth();
  }, []);
   if (!chartData) return <p>Loading Graph.....</p>;
   return <Line data={chartData}/>;
   

 }

 export default AdminLineChart;