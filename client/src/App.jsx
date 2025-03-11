import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import {Provider} from "react-redux"
import appStore from './utils/appStore'
import Feed from './components/Feed'

function App() {

  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Body />} >
            <Route path='/login' element={<Login />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>  
    </>
  )
}

export default App
