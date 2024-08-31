import React, { useContext, useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
    }
  return (
      <div className='navbar'>
          <Link to={'/'}><img src={assets.foodease_logo} alt="FoodEase Logo" className='logo' /></Link>
          <ul className="navbar-menu">
              <Link to={'/'} onClick={()=>setMenu("home")} className={menu==='home'?'active':''}>Home</Link>
              <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==='menu'?'active':''}>Menu</a>
              <a href='#app-download' onClick={()=>setMenu("mobileApp")} className={menu==='mobileApp'?'active':''}>Mobile App</a>
              <a href='#footer' onClick={()=>setMenu("contact")} className={menu==='contact'?'active':''}>Contact Us</a>
          </ul>
          <div className="navbar-right">
                <img src={assets.search_icon} alt="Search" />
                <div className="navbar-cart">
                    <Link to={'/cart'}><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot" }></div>
                </div>
                {!token
                    ? <button button onClick={() => setShowLogin(true)} className='signup-btn'>Sign In</button>
                  : <div className='navbar-profile'>
                      <img src={assets.profile_icon} alt="" />
                      <ul className="nav-profile-dropdown">
                          <li onClick={()=>navigate("/myOrders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                          <hr />
                          <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                      </ul>
                    </div>
                }
          </div>
    </div>
  )
}

export default Navbar