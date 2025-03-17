import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try{
      const response = await axios.get(BASE_URL + '/profile/view', {
        withCredentials: true,
      });
      dispatch(addUser(response.data))
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser();
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