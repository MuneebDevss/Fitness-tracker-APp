import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import heart from "../assets/images/heart.png";

export default function Header() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isFeedBack = location.pathname === "/signup";

  // Fetch current user function
  const fetchCurrentUser = async () => {
    try {
      const token = Auth.getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:5000/api/user/getCurrent", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user");
      }

      const userData = await response.json();
      
      setUserRole(userData.role);
    } catch (error) {
      console.error("Error fetching current user:", error);

      localStorage.removeItem("token");
      
    }
  };

  useEffect(() => {
    if (loggedIn) fetchCurrentUser();
  }, []);

  return (
    <Navbar collapseOnSelect expand="sm" variant="dark" bg={loggedIn ? "dark" : null}>
      {loggedIn ? (
        <>
          <Navbar.Brand as={Link} to="/" className="brand d-flex align-items-center">
            <img alt="heart" src={heart} className="heart-icon" />
            FitTrack
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              {userRole === "Admin" ? (
                <Nav.Link as={Link} to="/AdminFeedBack" eventKey="1">
                  Admin Feedback
                </Nav.Link>
              ) :userRole === "User"? (
                <>
                  <Nav.Link as={Link} to="/exercise" eventKey="1">
                    Exercise
                  </Nav.Link>
                  <Nav.Link as={Link} to="/history" eventKey="2">
                    History
                  </Nav.Link>
                  <Nav.Link as={Link} to="/GiveFeedBack" eventKey="2">
                  GiveFeedBack
                  </Nav.Link>
                  <Nav.Link as={Link} to="/TrainersPage" eventKey="2">
                  Follow Trainer
                  </Nav.Link>
                  <Nav.Link as={Link} to="/TrainersAdvice" eventKey="2">
                  TrainersAdvice
                  </Nav.Link>
                </>
              ):(
                <>
                  <Nav.Link as={Link} to="/exercise" eventKey="1">
                    Exercise
                  </Nav.Link>
                  <Nav.Link as={Link} to="/history" eventKey="2">
                    History
                  </Nav.Link>
                  <Nav.Link as={Link} to="/GiveFeedBack" eventKey="2">
                  GiveFeedBack
                  </Nav.Link>
                </>
              )}
              <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : (
        <>
          <Navbar.Brand as={Link} to="/" className="brand mx-auto d-flex align-items-center">
            <img alt="heart" src={heart} className="heart-icon" />
            FitTrack
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              {!isLoginPage && <Nav.Link as={Link} to="/login" eventKey="1">Login</Nav.Link>}
              {!isSignupPage && <Nav.Link as={Link} to="/signup" eventKey="2">Signup</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
}
