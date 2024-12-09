const jwt = require("jsonwebtoken");
const { User } = require("../models");  // Adjust the path as needed

// Middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
  // Check if the Authorization header is present
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "You need to be logged in!" });
  }

  try {
    // Verify the token using your secret key (ensure it's the same secret used when signing the token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database (optional, but good practice)


    // Attach the user info to the request object for use in the route
    req.user = decoded.data;
    
    next();  // Pass the request to the next handler
  } catch (err) {
    // Token validation failed
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

module.exports = authenticate;
