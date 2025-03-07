import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<div>Base Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/test" element={<div>Test Page</div>} />
        </Routes>
      </BrowserRouter>

      {/* <Navbar />
      <h1 className='text-3xl'>hello world</h1>   */}
    </>
  )
}

export default App
