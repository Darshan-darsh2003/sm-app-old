import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { RecoveryContext } from "./Form";
import axios from "axios";
import Reset from "./Reset";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setResetEmail } from "../../state";

const OTPInput = () => {
  const { email, otp } = useContext(RecoveryContext);
  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isResetPassword = pageType === "reset";

  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has succesfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);
  }

  // function setPageReset() {
  //   setPageType("reset");
  // }

  function verfiyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      dispatch(
        setResetEmail({
          email: email,
        })
      );
      navigate("/resetPassword");

      return;
    }

    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
        <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div
                style={{ display: "flex", marginLeft: "180px" }}
                className="font-semibold text-3xl"
              >
                <h2 style={{ whiteSpace: "nowrap" }}>Email Verification</h2>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p style={{ whiteSpace: "nowrap", marginLeft: "80px" }}>
                  We have sent a code to your email {email}
                </p>
              </div>
            </div>

            <div>
              <form>
                <div className="flex flex-col space-y-16">
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "40px",
                      marginBottom: "50px",
                      marginLeft: "40px",
                    }}
                    className="flex flex-row items-center justify-between mx-auto w-full max-w-xs"
                  >
                    <div style={{ marginLeft: "70px" }} className="w-16 h-16 ">
                      <input
                        style={{
                          borderRadius: "5px",
                          height: "80px",
                          width: "80px",
                          fontSize: "45px",
                          fontWeight: "bolder",
                          paddingLeft: "28px",
                        }}
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                        onChange={(e) =>
                          setOTPinput([
                            e.target.value,
                            OTPinput[1],
                            OTPinput[2],
                            OTPinput[3],
                          ])
                        }
                      ></input>
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        style={{
                          borderRadius: "5px",
                          height: "80px",
                          width: "80px",
                          fontSize: "45px",
                          fontWeight: "bolder",
                          paddingLeft: "28px",
                        }}
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                        onChange={(e) =>
                          setOTPinput([
                            OTPinput[0],
                            e.target.value,
                            OTPinput[2],
                            OTPinput[3],
                          ])
                        }
                      ></input>
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        style={{
                          borderRadius: "5px",
                          height: "80px",
                          width: "80px",
                          fontSize: "45px",
                          fontWeight: "bolder",
                          paddingLeft: "28px",
                        }}
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                        onChange={(e) =>
                          setOTPinput([
                            OTPinput[0],
                            OTPinput[1],
                            e.target.value,
                            OTPinput[3],
                          ])
                        }
                      ></input>
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        style={{
                          borderRadius: "5px",
                          height: "80px",
                          width: "80px",
                          color: "#000",
                          fontSize: "45px",
                          fontWeight: "bolder",
                          paddingLeft: "28px",
                        }}
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                        onChange={(e) =>
                          setOTPinput([
                            OTPinput[0],
                            OTPinput[1],
                            OTPinput[2],
                            e.target.value,
                          ])
                        }
                      ></input>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        type="click"
                        onClick={() => verfiyOTP()}
                        className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                        style={{
                          background: "#000",
                          color: "white",
                          width: "140px",
                          height: "50px",
                          borderRadius: "10px",
                          marginLeft: "220px",
                        }}
                      >
                        Verify Account
                      </button>
                    </div>

                    <div
                      style={{
                        marginLeft: "420px",
                        marginTop: "20px",
                        whiteSpace: "nowrap",
                      }}
                      className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500"
                    >
                      <p>Didn't recieve code?</p>{" "}
                      <a
                        className="flex flex-row items-center"
                        style={{
                          // color: disable ? "gray" : "blue",
                          // cursor: disable ? "none" : "pointer",
                          // textDecorationLine: disable ? "none" : "underline",
                          textDecoration: "none",
                          // border: "1px solid #000",
                          color: "blue",
                        }}
                        onClick={() => resendOTP()}
                      >
                        {disable
                          ? `Resend OTP in ${timerCount}s`
                          : "Resend OTP"}
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPInput;
