import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import Header from "./Header";
import cardioIcon from "../assets/images/cardio-w.png";

const handleError = (error) => {
    console.error("Error occurred:", error);
    alert("Something went wrong. Please try again.");
};

export default function Cardio() {
    const [cardioForm, setCardioForm] = useState({
        name: "",
        distance: "",
        duration: "",
        date: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const loggedIn = Auth.loggedIn();

    const handleCardioChange = (event) => {
        const { name, value } = event.target;
        setCardioForm({ ...cardioForm, [name]: value });
    };

    const handleDateChange = (date) => {
        setStartDate(date);
        handleCardioChange({
            target: { name: "date", value: date }
        });
    };

    const createCardio = async (cardioData, token) => {
        try {
            const response = await fetch("http://localhost:5000/api/exercise/cardio", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cardioData),
            });

            if (!response.ok) {
                throw new Error('Failed to create cardio exercise');
            }

            return await response.json();
        } catch (error) {
            handleError(error);
        }
    };

    const validateForm = (form) => {
        return form.name && form.distance && form.duration && form.date;
    };

    const handleCardioSubmit = async (event) => {
        event.preventDefault();

        // Get token
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        // Get user id
        const userId = Auth.getUserId();

        // Cardio submit
        if (validateForm(cardioForm)) {
            try {
                // Add userId to cardio form
                cardioForm.userId = userId;

                // Call the function to create cardio
                const response = await createCardio(cardioForm, token);

                // If the response is successful
                if (response) {
                    setMessage("Cardio successfully added!");
                    setError("");  // Reset error message (if any)
                    setTimeout(() => {
                        setMessage(""); // Clear the success message after 3 seconds
                    }, 3000);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to add cardio. Please try again.");
                setMessage("");  // Reset success message if there's an error
            }
        } else {
            setError("Please fill out all fields.");
        }

        // Clear form input after submission
        setCardioForm({
            name: "",
            distance: "",
            duration: "",
            date: ""
        });
    };

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='cardio'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='cardio-form d-flex flex-column' onSubmit={handleCardioSubmit}>
                    <div className='d-flex justify-content-center'>
                        <img alt="cardio" src={cardioIcon} className="exercise-form-icon" />
                    </div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Running"
                        value={cardioForm.name}
                        onChange={handleCardioChange}
                    />
                    <label>Distance (miles):</label>
                    <input
                        type="number"
                        name="distance"
                        id="distance"
                        placeholder="0"
                        value={cardioForm.distance}
                        onChange={handleCardioChange}
                    />
                    <label>Duration (minutes):</label>
                    <input
                        type="number"
                        name="duration"
                        id="duration"
                        placeholder="0"
                        value={cardioForm.duration}
                        onChange={handleCardioChange}
                    />
                    <label>Date:</label>
                    <DatePicker
                        selected={startDate}
                        value={cardioForm.date}
                        onChange={handleDateChange}
                        placeholderText="mm/dd/yyyy"
                    />
                    <button
                        className='submit-btn cardio-submit-btn'
                        type="submit"
                        disabled={!validateForm(cardioForm)}
                    >
                        Add
                    </button>
                </form>
                {message && <p className='message success'>{message}</p>}
                {error && <p className='message error'>{error}</p>}
            </div>
        </div>
    );
}
