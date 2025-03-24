import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        BASE_URL +"/signup",
        { 
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      dispatch(addUser(response.data));
      return navigate("/profile");

    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        BASE_URL +"/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/");

    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className=" flex flex-grow justify-center items-center">
      <div className="card bg-base-200 text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">{isLoginForm? "Login": "SignUp"}</h2>
          <div className="card-actions justify-center">
            { !isLoginForm && <><fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </fieldset></>}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter your email"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </fieldset>
          </div>
          <div className="card-actions flex items-center justify-center flex-col">
          {error && <p className="text-red-500">{error}</p>}
            <button className="btn bg-primary mt-2" onClick={isLoginForm? handleLogin: handleSignUp}>
              {isLoginForm? "Login" : "SignUp"}
            </button>
            </div>
            <p className="m-auto mt-4 ">
              {isLoginForm
                ? "Don't have an account?"
                : "Already have an account?"}
              <span
                className="text-blue-500 cursor-pointer mx-1"
                onClick={() => setIsLoginForm(!isLoginForm)}
              >
                {isLoginForm ? "SignUp" : "Login"}
              </span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
