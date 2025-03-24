import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import UserCard from "./UserCard";

const Connections = () => {
  const dispatch = useDispatch();

  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length == 0) return <h1>No Connections Found</h1>;

  return (
    <div className="h-screen flex w-full justify-center  ">
      <div className="text-center">
        <h1 className="font-bold text-3xl text-white">Connections</h1>
        {/* <div className="w-full flex gap-2 "> */}
        {connections.map((connection) => {
          const { firstName, lastName, photoURL, age, gender, about } =
            connection;
          return (
            <div key={connection?._id} className="m-4 p-4 rounded-lg bg-base-300 flex gap-6">
                <div>
                  {photoURL && (
                    <img src={photoURL} alt="photo" className="w-25 h-25 rounded-full" />
                  )}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h2 className="font-bold">{firstName + " " + lastName}</h2>
                  {age && gender && <p>{age+", "+gender}</p>}
                  <p className="">{about}</p>
                </div>
            </div>
          );
        })}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Connections;
