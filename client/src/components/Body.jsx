import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData= useSelector((store) => store.user);

  const fetchUser = async () => {
    try{
      const response = await axios.get(BASE_URL + '/profile', {
        withCredentials: true,
      });
      dispatch(addUser(response.data))
    }catch(err){
      console.log(err.status)
      if(err.status == 404){
        navigate("/login");
      }
      console.log(err); 
    }
  }

  useEffect(() => {
    if(!userData){
      fetchUser();
    }
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow flex'>
        <Outlet />
      </div>
      <div>
      <Footer />
      </div>
    </div>
  )
}

export default Body