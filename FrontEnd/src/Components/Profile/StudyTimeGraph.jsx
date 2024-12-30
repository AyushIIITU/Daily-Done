import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, differenceInMinutes, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function StudyGraph({ data }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const calculateDuration = (start, end) => {
    return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
  };
  const maxDuration = Math.max(
    ...data.map(session => calculateDuration(session.StartTime, session.EndTime))
  );

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Study data</h2>
      </div>
      
      <div className="space-y-4">
        {data.map(session => {
          const duration = calculateDuration(session.StartTime, session.EndTime);
          const percentage = (duration / maxDuration) * 100;
          
          return (
            <div key={session._id} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatDate(session.StartTime)}</span>
                <span>{duration.toFixed(1)} hours</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total data: {data.length} | 
          Total Hours: {data.reduce((acc, session) => 
            acc + calculateDuration(session.StartTime, session.EndTime), 0
          ).toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default StudyGraph;
