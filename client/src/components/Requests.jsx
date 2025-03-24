import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequests } from '../utils/requestSlices';

const Requests = () => {
    const requests = useSelector((store)=> store.requests);

    const dispatch = useDispatch();

    const fetchRequests = async(req, res)=>{
        try{
            const res = await axios.get(BASE_URL + "/user/request/received", {withCredentials: true});
            dispatch(addRequests(res?.data?.data));
        }catch(err){
            console.log("Error in show Requests")
        }

    }

    useEffect(()=>{
        fetchRequests();
    }, [])

    const reviewRequest = async(status, _id)=>{
        try{
            const res = await axios.post(BASE_URL+"/request/review/"+status+"/"+_id, {}, {withCredentials: true});
            dispatch(removeRequests(_id));
        }catch(err){
            console.log("Error in reviewRequest: "+err);
        }
    }

    if(!requests) return;
    if(requests.length===0) return <h1 className='text-2xl w-full flex justify-center my-10'>No Requests Found!</h1>

  return (
    <div className="h-screen flex w-full justify-center  ">
      <div className="text-center">
        <h1 className="font-bold text-3xl text-white">Requests</h1>
        {requests.map((request)=>{
            const {_id, firstName, lastName, photoURL, age, gender, about} = request?.fromUserId;
            return (
                <div key={request?._id} className="m-4 p-4 rounded-lg bg-base-300 flex gap-6">
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
                <div className="card-action my-4 flex justify-center items-center gap-1">
            <button className="btn bg-secondary" onClick={(()=>reviewRequest("accepted", request?._id))}>Accept</button>
            <button className="btn bg-primary" onClick={(()=>reviewRequest("rejected", request?._id))}>Reject</button>
          </div>
            </div>
            )
        })}
    </div>
    </div>
  )
}

export default Requests