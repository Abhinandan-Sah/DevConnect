import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate("/feed");

    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className=" flex flex-grow justify-center items-center">
      <div className="card bg-base-200 text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="card-actions justify-center">
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
            <button className="btn bg-primary mt-2" onClick={handleLogin}>
              Login
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
