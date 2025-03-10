import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //     postData();
  // }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (err) {
      console.log("error");
      console.log(error);
    }
  };

  return (
    <div className=" flex flex-grow justify-center items-center">
      <div className="card bg-base-200 text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="card-actions justify-center">
            {/* <form method="POST" action={handleLogin()}> */}
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
            <button className="btn bg-primary mt-2" onClick={handleLogin}>
              Login
            </button>
            {/* </form> */}
          </div>
        </div>

        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="card-actions justify-center">
            {/* <form method="POST" action={handleLogin()}> */}
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
            <button className="btn bg-primary mt-2" onClick={handleLogin}>
              Login
            </button>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
