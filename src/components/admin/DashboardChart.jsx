import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import API_URL from '../../constants/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart = () => {
  const [chartData, setChartData] = useState(null);

  const [numbers, setNumbers] = useState(null);
  const fetchNumbers = async () => {
    const {data} = await axios.get(`${API_URL}log/last-15-days`)
    setNumbers(data);
  }

  useEffect(() => {
    fetchNumbers();
  }, []);
  useEffect(() => {
    if(!numbers) return
    console.log(numbers)
    const labels = numbers.map(item => new Date(item.date).toLocaleDateString());
    const chartValues = numbers.map(item => item.count);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Logs Count',
          data: chartValues,
          backgroundColor: 'rgb(157,19,19)',
          borderRadius: 5,
          barPercentage: 0.5,
          borderColor: 'rgb(127,29,29)',
          borderWidth: 1,
        },
      ],
    });
  }, [numbers]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-lg" style={{ width: '100%', height: '30vh' }}>
      <div className="mt-4" style={{ height: '100%' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.raw.toLocaleString()}`;
                  },
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  autoSkip: true,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return `${value.toLocaleString()}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
