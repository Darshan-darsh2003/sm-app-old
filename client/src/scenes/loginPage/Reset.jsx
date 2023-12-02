import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const resetSchema = yup.object().shape({
  password: yup
    .string()
    .required("required")
    .min(8, "Must be greater than 8 characters")
    .max(15, "Must be lesser than 15 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .required("Confirm Password is required"),
});

const initialValuesReset = {
  password: "",
  confirmPassword: "",
};

export default function Reset() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const email = useSelector((state) => state.resetEmail);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const changePassword = async (e, password, confirmPassword) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      console.log(message);

      return;
    }

    if (password === confirmPassword) {
      setMessage("Passwords are equal");
      console.log(message);
      console.log("the email:", email);
      console.log("the new password: ", password);

      try {
        const response = await axios
          .post("http://localhost:3001/reset-password", {
            email: email,
            password: password,
          })

          .then((response) => {
            console.log("after recieving response");
            toast.success("Successfully Reset Password", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setMessage(response);

            setTimeout(() => {
              navigate("/");
              window.location.reload(true);
            }, 2000);
            // alert("successfully reset password");
          })

          .catch((error) => {
            console.log("failed to send request", error);
          });

        // const response = await fetch(`http://localhost:3001/reset-password`, {
        //   method: "PATCH",

        //   body: JSON.stringify({ email: email, password: password }),
        // });

        // const response = await axios

        //   .put("http://localhost:3001/reset-password", {
        //     email,
        //     password,
        //   })
        //   .then((response) => {
        //     console.log(response.status);
        //     console.log(response.message);
        //     alert("successfully reset password");
        //   });

        // setMessage(response);
        // navigate("/");
      } catch (error) {
        setMessage(error);
        console.log("error in post", error);
      }
    }
  };

  return (
    <>
      <Box>
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          p="1rem 6%"
          textAlign="center"
        >
          <Typography fontWeight="bold" fontSize="32px" color="black">
            Reset Password
          </Typography>
        </Box>

        <Box
          width={isNonMobileScreens ? "50%" : "93%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Formik
            onSubmit={changePassword}
            initialValues={initialValuesReset}
            validationSchema={resetSchema}
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
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <>
                    <TextField
                      label=" Enter New Password"
                      type="password"
                      onBlur={handleBlur}
                      // onChange={(e) => setPassword(e.target.value)}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={
                        Boolean(touched.password) && Boolean(errors.password)
                      }
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />

                    <TextField
                      // label=" Enter Password"
                      label="Confirm Password"
                      type="password"
                      onBlur={handleBlur}
                      // onChange={(e) => setConfirmPassword(e.target.value)}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      error={
                        Boolean(touched.confirmPassword) &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      sx={{ gridColumn: "span 4" }}
                    />
                  </>
                </Box>

                <Box>
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      type="submit"
                      sx={{
                        m: "2rem 0",
                        p: "1rem",
                        backgroundColor: "#0e69a2",
                        color: "white",
                        "&:hover": {
                          color: "#0e69a2",
                          borderColor: "#0e69a2",
                        },
                      }}
                      onClick={(e) => {
                        changePassword(
                          e,
                          values.password,
                          values.confirmPassword
                        );
                      }}
                    >
                      SET PASSWORD
                    </Button>
                  </>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        <ToastContainer />
      </Box>
    </>
  );
}
