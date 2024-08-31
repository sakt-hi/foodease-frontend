import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useEffect } from 'react';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {
    
    const {url,setToken} = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {

        event.preventDefault();

        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);
        
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        }

        else {
            alert(response.data.message);
        }

    }

  return (
      <div className="login-popup">
          <form onSubmit={onLogin} className="login-popup-container">
              <div className="login-popup-title">
                  <h2>{currState} </h2>
                  <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
              </div>
              <div className="login-popup-inputs">
                  {currState=== 'Login' ? <></> : <input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your name' required />}
                  <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Your email' required />
                  <input type="password" name='password' onChange={onChangeHandler} value={data.password} placeholder='Password' required />
              </div>
              <div className="login-popup-condition">
                  <input type="checkbox" required />
                  <p>By continuing, I agree to the terms of use & privacy policy</p>
              </div>
              <button type='submit'>{currState === 'Sign Up' ? "Create account" : "Login"}</button>
              {currState === "Login"
                  ? <p>New here? <span onClick={()=>setCurrState("Sign Up")} >Create an account</span> </p>
                  : <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login</span></p>
              }
          </form>
    </div>
  )
}

export default LoginPopup