import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../Utils/API';

const GitHubHeatmap = ({ username }) => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.post(`${API}/api/user/fetchGithubYear`, {
          url: `/${username}?tab=contributions&from=2024-01-01&to=2024-12-31`,
          year: 2024,
          format: 'flat',
        });
        console.log(response.data.contributions);
        setContributions(response.data.contributions);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (username) {
      fetchContributions();
    }
  }, [username]);

  const today = new Date();
  const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case '1':
        return 'bg-green-100';
      case '2':
        return 'bg-green-300';
      case '3':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex flex-col items-center overflow-x-auto overflow-y-hidden h-64 justify-center  min-w-[50vw]">
      {/* <h3 className="text-2xl font-semibold mb-4">GitHub Contributions for {username}</h3> */}
      
      {/* Responsive grid: rotation removed on smaller screens */}
      <div className="grid grid-cols-7 gap-1 max-w-full sm:max-w-lg -rotate-90">
        {contributions.length > 0 ? (
          contributions.map((day, index) => (
            <div
              key={index}
              className={`w-[1vh] h-[1vh]  sm:w-6 sm:h-6  rounded ${getIntensityClass(day.intensity)}`}
              title={`${day.date}: ${day.count} contributions`}
              style={{ backgroundColor: day.color }}
            ></div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default GitHubHeatmap;
