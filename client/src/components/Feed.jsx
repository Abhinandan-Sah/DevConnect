import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import axios from 'axios';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  console.log(feed)
  const dispatch = useDispatch();
  useEffect(() => {
    if(!feed){
    getFeed();
    }
  }, [dispatch, feed]);

  const getFeed = async(req, res)=>{
    try{
      const response = await axios.get(BASE_URL+"/feed", {withCredentials: true})
      dispatch(addFeed(response.data));
    }catch(err){
      console.log(err?.response?.data || "Something went wrong");
    }
  };

  const users = feed?.data;

  return (
    <>
      {feed?.data?.map((user) => (
        <UserCard key={user?._id || user?.emailId} user={user} />
      ))}
    </>
  );
  
  
};

export default Feed;