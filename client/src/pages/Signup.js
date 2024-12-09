import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header";

const handleError = (error) => {
  console.error("Error occurred:", error);
  alert(error.message || "Something went wrong. Please try again.");
};
const createUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default function Signup() {
  const loggedIn = Auth.loggedIn();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    role: "User", // Default role set to Trainer
  });
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createUser(formState);
      Auth.login(response.token);
    } catch (err) {
      handleError(err);
      setAlertMessage(err.message);
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
        {/* --------------------username-------------------- */}
        <label htmlFor="username">Username</label>
        <input
          className="form-input"
          value={formState.username}
          placeholder="Your username"
          name="username"
          type="username"
          onChange={handleChange}
        />
        {/* --------------------email-------------------- */}
        <label htmlFor="email">Email</label>
        <input
          className="form-input"
          value={formState.email}
          placeholder="youremail@gmail.com"
          name="email"
          type="email"
          onChange={handleChange}
        />
        {/* --------------------password-------------------- */}
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
        />
        {/* --------------------role-------------------- */}
        <label htmlFor="role">Role</label>
        <select
          className="form-input"
          name="role"
          value={formState.role}
          onChange={(handleChange)}
        >
          <option value="User">User</option>
          <option value="Trainer">Trainer</option>
        </select>
        {/* --------------------sign up btn-------------------- */}
        <div className="btn-div">
          <button
            disabled={!(formState.username && formState.email && formState.password && formState.role)}
            className="signup-btn mx-auto my-auto"
          >
            Sign Up
          </button>
        </div>
        {/* --------------------login link-------------------- */}
        <p className="link-btn">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        {alertMessage && <div className="err-message">{alertMessage}</div>}
      </form>
    </div>
  );
}
