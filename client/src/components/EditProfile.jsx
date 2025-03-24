import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAbout(user.about || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]); // Runs whenever `user` changes

  const saveProfile = async () => {
    setError("");
    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          photoURL,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(response?.data?.data));
      setShowToast(true);
      const i = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };
  return (
    <>
      <div className=" flex flex-grow  justify-center my-10 gap-4">
        <div className="flex justify-center">
          <div className="card bg-base-200 text-primary-content w-96">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className="card-actions justify-center">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name:</legend>
                  <input
                    type="text"
                    className="input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name:</legend>
                  <input
                    type="text"
                    className="input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Photo URL:</legend>
                  <input
                    type="text"
                    className="input"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                  />
                </fieldset>
                <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age:</legend>
                  <input
                    type="number"
                    className="input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
                
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender:</legend>
                  {/* <input
                    type="text"
                    className="input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  /> */}
                  <div className="dropdown dropdown-start w-full">
                    <div tabIndex={0} role="button" className="btn w-full">
                      {gender || "Select Gender"} ⬇️
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box w-full p-2 shadow-sm"
                    >
                      <li>
                        <button onClick={() => setGender("Male")}>Male</button>
                      </li>
                      <li>
                        <button onClick={() => setGender("Female")}>
                          Female
                        </button>
                      </li>
                      <li>
                        <button onClick={() => setGender("Other")}>
                          Other
                        </button>
                      </li>
                    </ul>
                  </div>
                </fieldset>
                </div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">About:</legend>
                  {/* <input
                    type="text"
                    className="input"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  /> */}
                  <textarea
                    className="textarea"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </fieldset>
              </div>
              <div className="card-actions flex items-center justify-center flex-col">
                {error && <p className="text-red-500">{error}</p>}
                <button className="btn bg-primary mt-2" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
        <div className="card bg-base-200  shadow-sm">
        <figure>
          {photoURL && <img src={photoURL} alt="photo" className="h-50 w-full" />}
        </figure>
        <div className="card-body">
          <h2 className="card-title ">{firstName + " " + lastName}</h2>
          {age && gender && (
            <>
              <h4>{age + ", " + gender}</h4>
              <h4>{about}</h4>
            </>
          )}
        </div>
      </div>
      </div>
        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-success">
              <span>Profile saved successfully.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
