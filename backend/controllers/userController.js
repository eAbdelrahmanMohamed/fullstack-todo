const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const User = require("../models/User");
const { loginSchema } = require("../joi-validations/userValidation");

exports.register = async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.create({ email, password: hashedPassword });
  
      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
exports.login = async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Email not found" });
  
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });
  
      const token = jwt.sign(
        { _id: user._id, email: user.email }, // include email here
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
            res.json({ token  , email});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
