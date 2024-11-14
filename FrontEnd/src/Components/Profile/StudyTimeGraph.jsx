import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, differenceInMinutes, parseISO } from 'date-fns';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudyGraph = ({ data }) => {
  // Process each session to calculate duration and format start times
  const processedData = data.map(item => {
    const startTime = parseISO(item.StartTime);
    const endTime = parseISO(item.EndTime);
    const duration = differenceInMinutes(endTime, startTime); // in minutes

    return {
      label: `${format(startTime, 'yyyy-MM-dd HH:mm')} - ${format(endTime, 'HH:mm')}`, // Label with start and end times
      duration,
    };
  });

  // Chart.js data structure for individual sessions
  const chartData = {
    labels: processedData.map(d => d.label), // Each session's start and end time as labels
    datasets: [
      {
        label: 'Study Duration (minutes)',
        data: processedData.map(d => d.duration),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Session Start - End' },
      },
      y: {
        title: { display: true, text: 'Duration (minutes)' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Individual Study Sessions</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StudyGraph;
