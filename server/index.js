import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

///////////////////////////////////////////////////////////////////////////////////
////////////////UNDER DEVELOPMENT////////////////////////////////////
////////////////////////////////////////////////////////////////

app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// app.post("/reset-password", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the user's password
//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();

    // Send the users to the client
    // console.log(users);
    res.status(203).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // console.log(email);

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    console.log("user found", user);

    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = passwordHash;
    await user.save();

    console.log(passwordHash);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/send_recovery_email", async (req, res) => {
  try {
    const { recipient_email } = req.body;
    const user = await User.findOne({ email: recipient_email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
    console.log("verification: ", recipient_email);
    console.log(req.body);

    sendEmail(req.body)
      .then((response) => {
        res.send(response.message);
        console.log(response.message);
      })
      .catch((error) => res.status(500).send(error.message));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function sendEmail({ recipient_email, OTP }) {
  console.log("BREAKPOINT : inside the sendEmail");

  return new Promise(async (resolve, reject) => {
    console.log("BREAKPOINT : inside the promise");
    console.log(process.env.MY_EMAIL);
    console.log(process.env.MY_PASSWORD);
    var transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    console.log("BREAKPOINT : after successful email login");

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "PASSWORD RECOVERY EMAIL FROM INTERACTO",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  
</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Interacto</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing InterActo. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Interacto</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>InterActo Inc</p>
      <p>Banglore 101 street,rajajinagar</p>
      <p>India</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };

    console.log("BREAKPOINT : in drafting mail");

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);

        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

///////////////////////////////////////////////////////////////////////////////////
////////////////UNDER DEVELOPMENT////////////////////////////////////
////////////////////////////////////////////////////////////////

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Port: ${PORT}`);
      console.log("mongoDB connected successfully");
    });

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
