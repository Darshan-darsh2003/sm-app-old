import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import nodemailer from "nodemailer";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const otpVerification = async (req, res) => {
  try {
    const { recipient_email } = req.body;
    const user = await User.findOne({ email: recipient_email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
    console.log("verification: ", recipient_email);
    console.log(req.body);

    sendEmail(req.body)
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const resetPassword = async (req, res) => {
//   const { email, password } = req.body;

//   console.log(email);

//   const salt = await bcrypt.genSalt();
//   const passwordHash = await bcrypt.hash(password, salt);

//   // console.log(email);

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     console.log("user found", user);

//     if (!user) {
//       console.log("user not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Hash the new password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the user's password
//     user.password = passwordHash;
//     await user.save();

//     console.log(passwordHash);

//     return res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
