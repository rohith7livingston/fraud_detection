// Graph.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function Graph() {
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Tony Stark',
        data: [20, 30, 45, 60, 70, 80, 60, 75, 90, 110, 130, 150, 160, 180, 190, 210, 220, 250, 270, 280, 290, 310, 330, 340, 360, 370, 380, 390, 400, 420],
        fill: true,
        backgroundColor: 'rgba(105, 90, 205, 0.3)',
        borderColor: '#6a5acd',
        tension: 0.4,
        pointRadius: 0,
        stack: 'stack1',
      },
      {
        label: 'Bruce Banner',
        data: [10, 20, 35, 45, 50, 60, 55, 65, 75, 85, 90, 100, 110, 120, 130, 145, 160, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300],
        fill: true,
        backgroundColor: 'rgba(255, 105, 180, 0.3)',
        borderColor: '#ff69b4',
        tension: 0.4,
        pointRadius: 0,
        stack: 'stack1',
      },
      {
        label: 'Peter Parker',
        data: [5, 15, 25, 35, 40, 50, 40, 55, 60, 70, 75, 80, 90, 95, 100, 110, 120, 130, 140, 145, 150, 160, 170, 175, 180, 185, 190, 195, 200, 210],
        fill: true,
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        borderColor: '#ffa500',
        tension: 0.4,
        pointRadius: 0,
        stack: 'stack1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          padding: 20,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Day of the Month',
          color: '#666',
        },
        ticks: {
          color: '#666',
        },
        grid: {
          color: '#eee',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Activity Count',
          color: '#666',
        },
        ticks: {
          color: '#666',
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Monthly Activity Overview</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default Graph;
