import React, { useState } from 'react';

const FeedbackForm = () => {
  const [userId, setUserId] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, description })
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setMessage('Feedback submitted successfully!');
        setMessageType('success');
        
        // Clear the form
        setUserId('');
        setDescription('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to submit feedback');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error: Unable to submit feedback');
      setMessageType('error');
      console.error('Error:', error);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: "url('/api/placeholder/1600/900')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <h2 
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333'
          }}
        >
          Submit Feedback
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Title" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required 
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
          <textarea 
            placeholder="Your Feedback (Max 30 characters)" 
            maxLength={30}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              minHeight: '100px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Submit Feedback
          </button>
        </form>
        
        {message && (
          <div 
            style={{
              marginTop: '15px',
              padding: '10px',
              textAlign: 'center',
              borderRadius: '5px',
              backgroundColor: messageType === 'success' 
                ? 'rgba(76, 175, 80, 0.1)' 
                : 'rgba(244, 67, 54, 0.1)',
              color: messageType === 'success' ? 'green' : 'red'
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;