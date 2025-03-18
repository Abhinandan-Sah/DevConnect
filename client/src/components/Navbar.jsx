import React from 'react'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((store)=> store.user);
  const dispatch = useSelector((store) => store.dispatch)

  const handleLogout = (async(req, res) => {
    try{
      await axios.post(BASE_URL + "/logout", {}, {withCredentials: true});
    }
    catch(err){
      // Error logic maybe redirect to error page
    }
  });

  return (
    <div className="navbar bg-base-200 shadow-sm">
  <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-xl">🧑‍💻DevConnect</Link>
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
          <Link to="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><Link>Settings</Link></li>
        <li><Link onClick={handleLogout}>Logout</Link></li>
      </ul>
    </div>

  </div>
      )}
</div>
  )
}

export default Navbar