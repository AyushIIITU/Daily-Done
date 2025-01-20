import { Clock } from 'lucide-react';
import { motion } from "framer-motion"; // Use framer-motion for animations

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
    ...data.map((session) => calculateDuration(session.StartTime, session.EndTime))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Study Data</h2>
      </div>

      <div className="space-y-4">
        {data.map((session) => {
          const duration = calculateDuration(session.StartTime, session.EndTime);
          const percentage = (duration / maxDuration) * 100;

          return (
            <div key={session._id} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatDate(session.StartTime)}</span>
                <span>{duration.toFixed(1)} hours</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total Sessions: {data.length} | Total Hours:{" "}
          {data
            .reduce((acc, session) => acc + calculateDuration(session.StartTime, session.EndTime), 0)
            .toFixed(1)}
        </p>
      </div>
    </motion.div>
  );
}

export default StudyGraph;
