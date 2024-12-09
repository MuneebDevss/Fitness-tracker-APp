import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Auth from "../utils/auth";
import Header from "../components/Header";
const handleError = (error) => {
  console.error("Error occurred:", error);
  alert("Something went wrong. Please try again.");
};


const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.email // sending email as username since backend checks both
      }),
    });
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error("Unexpected response from the server");
      }
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Auth.loggedIn();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(false);
    setErrorMessage("");
  
    try {
      const response = await loginUser(formState);
      const { token, user } = response;
      
      if (token) {
        Auth.login(token);
        setFormState({
          email: "",
          password: "",
        });
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Login failed");
      setShowAlert(true);
    }
  };
  

  // If the user is logged in, redirect to the home page
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form onSubmit={handleFormSubmit} className="signup-form d-flex flex-column">
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

        {/* -------------------- password-------------------- */}
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
        />

        {/* --------------------login btn-------------------- */}
        <div className="btn-div">
          <button disabled={!(formState.email && formState.password)}
            className="signup-btn mx-auto my-auto">Login</button>
        </div>
        {/* --------------------signup link-------------------- */}
        <p className="link-btn">
          New to FitTrack?{' '}
          <Link to="/signup" >Create one</Link>
        </p>
        {showAlert && <div className="err-message">Login failed</div>}
      </form>
    </div>
  );
}
