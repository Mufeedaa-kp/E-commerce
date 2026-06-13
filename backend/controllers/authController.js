
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
 

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

 
   
    const existingUser = await User.findOne({ email }).select("_id").lean()
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const user = await User.create({ name, email,password: hashedPassword })
 
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 

const loginUser = async (req, res) => {
  try {
     const email = req.body.email.toLowerCase().trim();
const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" })
    }
    if (user.isActive === false) {
  return res.status(403).json({
    message: "Account is deactivated",
  });
}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

  
    const token = jwt.sign(
      { id: user._id ,
        role:user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

  
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
 

const getProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();
 
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
 
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  })
}


 
module.exports = { registerUser, loginUser, getProfile, logoutUser }
 
