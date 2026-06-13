const jwt = require("jsonwebtoken")

const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        success:false,
        message: "Not authorized, no token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { id: decoded.id, _id: decoded.id,
       role: decoded.role,
    };
    next();
  } catch (error) {
     return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

module.exports = { protect }