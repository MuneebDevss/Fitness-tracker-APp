const jwt = require("jsonwebtoken");


const expiration = "5d";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, process.env.JWT_SECRET, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id,role }) {
    const payload = { username, email, _id,role };

    return jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: expiration });
  },
};
