const { User } = require("../models");
const { signToken } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const authenticate = require('../middlewares/authMiddleware');

// Async function to get user data
const getMe = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    console.log("User ID from request:", req.user.id);
    console.log("User Username from request:", req.user.username);

    const foundUser = await User.findOne({
      $or: [{ _id: req.user.id }, { username: req.user.username }],
    })
      .select("-__v")
      .populate("cardio")
      .populate("resistance");

    // If user not found in the database, log user ID and send a not found message
    if (!foundUser) {
      console.log("User not found in the database:", req.user.id);  // Log the user ID
      return res.status(400).json({ message: 'User not found!' });
    }

    // If no cardio or resistance data exists, set them to empty arrays
    if (!foundUser.resistance) {
      foundUser.resistance = [];
    }
    if (!foundUser.cardio) {
      foundUser.cardio = [];
    }

    res.json(foundUser); // Send the found user data as response
  } catch (err) {
    res.status(500).json(err); // Handle any server-side errors
  }
};
const getTrainerAdvice = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    console.log("User ID from request:", req.user._id);
    console.log("User Username from request:", req.user.username);

    const foundUser = await User.findOne({
      $or: [{ _id: req.user._id }, { username: req.user.username }],
    });
      const foundTrainer = await User.findById(foundUser.trainerId)
        .select("-__v")
        .populate("cardio")
        .populate("resistance");

    // If user not found in the database, log user ID and send a not found message
    if (!foundTrainer) {
      console.log("Trainer not found in the database:", req.user.id);  // Log the user ID
      return res.status(400).json({ message: 'Trainer not found!' });
    }

    // If no cardio or resistance data exists, set them to empty arrays
    if (!foundTrainer.resistance) {
      foundTrainer.resistance = [];
    }
    if (!foundTrainer.cardio) {
      foundTrainer.cardio = [];
    }

    res.json(foundTrainer); // Send the found user data as response
  } catch (err) {
    res.status(500).json(err); // Handle any server-side errors
  }
};

// Exporting routes
module.exports = {
  async getTrainers  (req, res){
    try {
        // Find all users with the role 'Trainer'
        const trainers = await User.find({ role: 'Trainer' })
            .select('-password') // Exclude password from the result
            .lean(); // Convert to plain JavaScript object for better performance

        // Check if any trainers are found
        if (!trainers || trainers.length === 0) {
            return res.status(404).json({ 
                message: 'No trainers found' 
            });
        }

        // Return the list of trainers
        res.status(200).json({
            message: 'Trainers retrieved successfully',
            count: trainers.length,
            trainers 
        });
    } catch (error) {
        // Handle any errors during the fetch process
        res.status(500).json({ 
            message: 'Error retrieving trainers', 
            error: error.message 
        });
    }
},

// Controller to update a user's trainer ID
async followTrainer   (req, res)  {
    try {
        const { userId, trainerId } = req.body;

        // Validate input
        if (!userId || !trainerId) {
            return res.status(400).json({ 
                message: 'User ID and Trainer ID are required' 
            });
        }

        // Find the user by ID and update the trainerId
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { trainerId: trainerId }, 
            { 
                new: true,  // Return the updated document
                runValidators: true // Run model validations
            }
        ).select('-password'); // Exclude password from the result

        // Check if user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        // Return the updated user
        res.status(200).json({
            message: 'User trainer ID updated successfully',
            user: updatedUser
        });
    } catch (error) {
        // Handle any errors during the update process
        res.status(500).json({ 
            message: 'Error updating user trainer ID', 
            error: error.message 
        });
    }},
  // Route for getting a single user (requires authentication)
  getSingleUser: [authenticate, getMe],
  getSingleTrainer: [authenticate, getTrainerAdvice],
  async getCurrentUser (req, res) {
    // Check if the Authorization header is present
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "You need to be logged in!" });
    }
  
    try {
      // Verify the token using your secret key (ensure it's the same secret used when signing the token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the user exists in the database (optional, but good practice)
  
      const username=decoded.data.username,email=decoded.data.email;
      
      // Attach the user info to the request object for use in the route
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      res.json(user);
    } catch (err) {
      // Token validation failed
      console.error(err);
      return res.status(401).json({ message: "Invalid or expired token!" });
    }
  },
  // Route for creating a user
  async createUser(req, res) {
    try {
      const { username, email, password,role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const user = await User.create({ username, email, password ,role});
      const token = signToken(user);  // Sign token after user creation
      return res.status(201).json({ message: "User created successfully", token, user });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Route for user login
  async login(req, res) {
    try {
      const { username, email, password } = req.body;

      // Find user by username or email
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      // Validate password
      const isPasswordCorrect = await user.isCorrectPassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials!" });
      }

      // Generate a token if credentials are valid
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
