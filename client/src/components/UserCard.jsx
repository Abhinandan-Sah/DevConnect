import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const {_id, firstName, lastName, age, gender, photoURL, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async(status, userId)=>{
    try{
      const res = await axios.post(BASE_URL+ "/request/send/" + status + "/"+ userId, {}, {withCredentials: true});
      console.log(res)
      console.log(userId)
      dispatch(removeUserFromFeed(userId))
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <div className="w-96 h-full mt-5">
      <div className="card bg-base-200  shadow-sm">
        <figure>
          {photoURL && <img src={photoURL} alt="photo" className="h-72 w-full" />}
        </figure>
        <div className="card-body">
          <h2 className="card-title ">{firstName + " " + lastName}</h2>
          {age && gender && (
            <>
              <h4>{age + ", " + gender}</h4>
              <h4 className="my-4">{about}</h4>
            </>
          )}
          <div className="card-action my-4 flex justify-center gap-1">
            <button className="btn bg-secondary" onClick={(()=> handleSendRequest("interested", _id))}>Interested</button>
            <button className="btn bg-primary" onClick={(()=> handleSendRequest("ignored", _id))}>Ignore</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default UserCard;
