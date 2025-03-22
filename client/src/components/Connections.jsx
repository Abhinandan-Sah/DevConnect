import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

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
  console.log(connections[0]?.firstName);

  return (
    <div className="h-screen w-full flex justify-center ">
      <div className="text-center">
        <h1 className="font-bold text-2xl">Connections</h1>
        {connections.map((connection) => (
          <div key={connection?._id}>
            <p className="text-center text-white">{connection?.firstName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
