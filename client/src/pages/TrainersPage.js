import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { toast } from 'react-toastify'; // Using react-toastify for notifications
import img from "../assets/images/run.jpg"
import { Alert } from 'react-bootstrap';
const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trainers when component mounts
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/user/getTrainers', {
          method: 'GET',
          
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }

        const data = await response.json();
        setTrainers(data.trainers);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch trainers');
        setIsLoading(false);
        toast.error('Failed to fetch trainers');
      }
    };

    fetchTrainers();
  }, []);

  // Handle follow action
  const handleFollow = async (trainerId) => {
    try {
      // Get the logged-in user's ID
      const userId = Auth.getUserId();
      console.log(userId);
      // Make follow request
      const response = await fetch('http://localhost:5000/api/user/followTrainer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Auth.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, trainerId })
      });

      if (!response.ok) {
        console.log('Failed to follow trainer');
        throw new Error('Failed to follow trainer');
        
      }
      alert('Trainer Added');
      // Show success message
      toast.success('Successfully followed trainer');

      // Optionally update UI to reflect follow status
      // This might involve updating the local state or refetching trainers
    } catch (err) {
      // Handle error
      toast.error(err.message || 'Failed to follow trainer');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading trainers...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Discover Trainers</h1>
      
      {trainers.length === 0 ? (
        <p className="text-center text-gray-500">No trainers found</p>
      ) : (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="max-w-sm rounded overflow-hidden shadow-lg">
              {/* Card content */}
              <img
  style={{ width: '100px', height: '100px' }}
  src={trainer.image || img}
  alt={trainer.username}
/>
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{trainer.username}</div>
                <p className="text-gray-700 text-base">{trainer.description || 'No description available'}</p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <button
                  onClick={() => handleFollow(trainer._id)}
                  className="bg-black  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainersPage;
