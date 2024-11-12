import React, { useState } from 'react';
// import TimerComponent from './TimerComponent';
import axios from 'axios';
import Group from './Group';

const TestTimer = () => {
  const [groupId, setGroupId] = useState(null);
  const [userId] = useState(`user_${Math.floor(Math.random() * 1000)}`);  // Simulated user ID for testing
  const [inputGroupId, setInputGroupId] = useState('');

  const createGroup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-group');
      setGroupId(response.data.groupId);
      alert(`Group created! Your Group ID: ${response.data.groupId}`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const joinGroup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/join-group', { groupId: inputGroupId });
      if (response.data.success) {
        setGroupId(inputGroupId);
      } else {
        alert("Group not found.");
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="app-container">
      {!groupId ? (
        <div className="group-actions">
          <button onClick={createGroup} className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Create Group</button>
          <input
            type="text"
            placeholder="Enter Group ID"
            value={inputGroupId}
            onChange={(e) => setInputGroupId(e.target.value)}
            className="input"
          />
          <button onClick={joinGroup} className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">Join Group</button>
        </div>
      ) : (
        <Group groupId={groupId} userId={userId} />
      )}
    </div>
  );
};

export default TestTimer;
