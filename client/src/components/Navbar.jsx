import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../utils/userSlice';
import axios from 'axios';

const Navbar = () => {
  const user = useSelector((store)=> store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async(req, res) => {
    try{
      await axios.post(BASE_URL + "/logout", {}, {withCredentials: true});
      dispatch(removeUser());
      navigate("/login");
    }
    catch(err){
      // Error logic maybe redirect to error page
      console.log(err.message);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-sm">
  <div className="flex-1">
    <Link to="/feed" className="btn btn-ghost text-xl">🧑‍💻DevConnect</Link>
  </div>
  {user && (
    <div className="flex gap-2">
    {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
    <div className='form-control'>Welcome, {user?.firstName}</div>
   <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={user.photoURL} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/" className="justify-between">
            Feed
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="justify-between">
            Profile
            {/* <span className="badge">New</span> */}
          </Link>
        </li>
        <li><Link to="/connections">Connections</Link></li>
        <li><Link to="/requests">See Requests</Link></li>
        <li><Link onClick={handleLogout}>Logout</Link></li>
      </ul>
    </div>

  </div>
      )}
</div>
  )
}

export default Navbar