import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";

import { createContext } from "react";
import axios from "axios";

import OTPInput from "./OTPInput";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RecoveryContext = createContext();

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "Must be greater than 8 characters")
    .max(15, "Must be lesser than 15 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");

  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const isOtpVerification = pageType === "otpVerification";
  const isForgotPassword = pageType === "forgotPassword"; //---

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    toast.success("User Created Successfully", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    setTimeout(() => {
      setPageType("login");
    }, 1000);
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();

    if (loggedInResponse.status === 200) {
      onSubmitProps.resetForm();
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );

      toast.success("Logged in Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }

    if (loggedInResponse.status === 400) {
      onSubmitProps.resetForm();
      toast.error("Invalid Credintials", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const otpVerification = async (req, res) => {
    console.log("this is otp verification page");
  };

  const forgotPassword = async (req, res) => {
    console.log("forgot password");
  };

  ///////////////////////////////////////////////////////////////////////////////////
  ////////////////UNDER DEVELOPMENT////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  if (email) {
    console.log(email);
  }

  function navigateToOtp() {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      console.log(OTP);
      setOTP(OTP);

      axios
        .post("http://localhost:3001/send_recovery_email", {
          OTP,
          recipient_email: email,
        })
        .then(() => {
          console.log("redirecting to otp verification");
          setPageType("otpVerification");
        })
        .catch((error) => {
          console.log("error in axios form input ", error);
        });
      return;
    }
    return alert("please enter your email");
  }

  ///////////////////////////////////////////////////////////////////////////////////
  ////////////////UNDER DEVELOPMENT////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);

    if (isForgotPassword) await forgotPassword(); //---
    if (isOtpVerification) await otpVerification(); //---
    // if (isResetPassword) await resetPassword(); //---
  };

  return (
    <RecoveryContext.Provider
      value={{ pageType, setPageType, otp, setOTP, email, setEmail }}
    >
      {!isForgotPassword && !isOtpVerification && (
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to InterActo, the best place for Interactions!
        </Typography>
      )}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}

              {!isForgotPassword && !isOtpVerification && (
                <>
                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </>
              )}

              {isOtpVerification && (
                <>
                  <OTPInput />
                </>
              )}
            </Box>

            {/* BUTTONS */}
            <Box>
              {(isLogin || isRegister) && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    type="submit"
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": {
                        color: palette.primary.main,
                        borderColor: palette.primary.main,
                      },
                    }}
                  >
                    {isLogin ? "LOGIN" : "REGISTER"}
                  </Button>
                </>
              )}
              <Box sx={{ display: "flex", gap: "5px" }}>
                {!isForgotPassword && (
                  <>
                    <Typography
                      onClick={() => {
                        setPageType(isLogin ? "register" : "login");
                        resetForm();
                      }}
                      sx={{
                        textDecoration: "underline",
                        color: palette.primary.main,
                        "&:hover": {
                          cursor: "pointer",
                          // color: palette.primary.light,
                          color: "#000",
                        },
                        mr: "auto",
                      }}
                    >
                      {isLogin
                        ? "Don't have an account? Sign Up here."
                        : "Already have an account? Login here."}
                    </Typography>
                  </>
                )}

                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "forgotPassword" : "login"); //---
                    resetForm(); //---

                    console.log("reset password");
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: "#000",
                    },
                    ml: "auto",
                  }}
                >
                  {isLogin ? "Forgot password ?? " : ""}
                </Typography>
              </Box>

              {isForgotPassword && (
                <>
                  <Typography
                    fontWeight="500"
                    variant="h5"
                    sx={{ mb: "1.5rem" }}
                  >
                    Enter your email below and recieve otp to reset password
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Email"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        //   value={values.email}
                        name="email"
                        //   error={
                        //     Boolean(touched.firstName) && Boolean(errors.firstName)
                        //   }
                        //   helperText={touched.firstName && errors.firstName}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        onClick={() => {
                          setPageType(
                            isForgotPassword ? "login" : "forgotPassword"
                          ); //---
                          resetForm(); //---

                          console.log("reset password");
                        }}
                        fullWidth
                        //   type="submit"
                        variant="outlined"
                        sx={{
                          m: "2rem 0",
                          p: "1rem",
                          borderColor: "#cf142b",
                          backgroundColor: "#cf142b",
                          color: palette.background.alt,
                          "&:hover": {
                            color: "#cf142b",
                            borderColor: "#cf142b",
                          },
                        }}
                      >
                        CANCEL
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigateToOtp()}
                        //   type="submit"
                        sx={{
                          m: "2rem 0",
                          p: "1rem",
                          backgroundColor: "#0e69a2",

                          borderColor: "#0e69a2",

                          color: palette.background.alt,
                          "&:hover": {
                            color: "#0e69a2",
                            borderColor: "#0e69a2",
                          },
                        }}
                      >
                        SEND OTP
                      </Button>
                    </Box>
                  </form>
                </>
              )}
              <ToastContainer />
            </Box>
          </form>
        )}
      </Formik>
    </RecoveryContext.Provider>
  );
};

export default Form;
