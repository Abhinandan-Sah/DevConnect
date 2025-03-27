import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, [dispatch, feed]);

  const getFeed = async (req, res) => {
    try {
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response?.data?.data));
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");
    }
  };

  if (!feed)
    return (
      <h1 className="text-2xl w-full flex justify-center my-10">Loading...</h1>
    );
  if (feed?.length === 0)
    return (
      <h1 className="text-2xl w-full flex justify-center my-10">
        No New Users Found!
      </h1>
    );
  return (
    // <div className='my-10 w-full flex justify-center items-center gap-3'>
    //   <div className='absolute'>
    //   {feed.map((user) => (
    //     <UserCard key={user?._id || user?.emailId} user={user} />
    //   ))}
    //   </div>
    // </div>
    <div className="w-full flex flex-col items-center justify-center ml-[-15%]">
    <div className="relative h-[500px]">
      {feed.map((user, index) => (
        <div
          key={user?._id || user?.emailId}
          className="absolute transition-all duration-500 ease-in-out"
          
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
    </div>
  );
};

export default Feed;
