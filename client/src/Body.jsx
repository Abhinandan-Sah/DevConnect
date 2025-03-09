import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {
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