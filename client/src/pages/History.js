import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';

import Auth from "../utils/auth";
import { formatDate } from '../utils/dateFormat';
import Header from "../components/Header";
import cardioIcon from "../assets/images/cardio.png";
import resistanceIcon from "../assets/images/resistance.png";

const handleError = (error) => {
  console.error("Error occurred:", error);
  alert("Something went wrong. Please try again.");
};

export default function History() {
  const [userData, setUserData] = useState({});
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(6);

  const loggedIn = Auth.loggedIn();

  const getMe = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      return await response.json();
    } catch (error) {
      handleError(error);
    }
  };

  // Run only when loggedIn changes
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return;

        const user = await getMe(token);
        if (!user) {
          throw new Error("Failed to fetch user data");
        }

        // Combine cardio and resistance data
        const exercise = [...(user.cardio || []), ...(user.resistance || [])];

        // Sort and format the exercise data
        exercise.sort((a, b) => new Date(b.date) - new Date(a.date));
        exercise.forEach(item => item.date = formatDate(item.date));

        setUserData(user);
        setExerciseData(exercise);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [loggedIn]);

  const showMoreItems = () => setDisplayedItems(displayedItems + 6);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="history">
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className="title">History</h2>
        {exerciseData.length ? (
          <div className="history-data">
            {exerciseData.slice(0, displayedItems).map((exercise) => {
              let dateToDisplay = exercise.date;
              return (
                <div className="history-div d-flex" key={exercise._id}>
                  <div className="date d-flex align-items-center">{dateToDisplay}</div>
                  <Link className="text-decoration-none" to={`/history/${exercise.type}/${exercise._id}`}>
                    {exercise.type === "cardio" ? (
                      <div className="history-card cardio-title d-flex">
                        <div className="d-flex align-items-center">
                          <img alt="cardio" src={cardioIcon} className="history-icon" />
                        </div>
                        <div>
                          <p className="history-name">{exercise.name}</p>
                          <p className="history-index">{exercise.distance} miles</p>
                        </div>
                      </div>
                    ) : (
                      <div className="history-card resistance-title d-flex">
                        <div className="d-flex align-items-center">
                          <img alt="resistance" src={resistanceIcon} className="history-icon" />
                        </div>
                        <div>
                          <p className="history-name">{exercise.name}</p>
                          <p className="history-index">{exercise.weight} pounds</p>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
            {exerciseData.length > displayedItems && (
              <div className="d-flex justify-content-center">
                <button className="show-btn" onClick={showMoreItems}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="history-text">No exercise data yet...</h3>
            <Link to="/exercise">
              <button className="home-btn">Add Exercise</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
