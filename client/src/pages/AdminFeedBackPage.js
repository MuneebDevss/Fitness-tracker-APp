import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/feedback');
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        
        const data = await response.json();
        setFeedback(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Unable to load feedback. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Delete feedback
  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedback(prevFeedback => 
        prevFeedback.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl text-red-500 mb-4">
            !
          </div>
          <h2 className="text-2xl text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>
        </div>

        {feedback.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">
              &#127381;
            </div>
            <p className="text-xl text-gray-500">No feedback available</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedback.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => deleteFeedback(item._id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;