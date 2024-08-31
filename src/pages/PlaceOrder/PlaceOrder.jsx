import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const PlaceOrder = ({setShowLogin}) => {

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        // Apply title case only for specific fields
        if (["firstName", "lastName", "street", "city", "state"].includes(name)) {
            value = toTitleCase(value);
        }
        setData(data => ({ ...data, [name]: value }));
    }

    const toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 25,
        }
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
        } else {
            alert("Something went wrong, Try again")
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/cart");
            setShowLogin(true);
        } else if (getTotalCartAmount() === 0) {
            navigate("/cart");
        } else {
            setShowLogin(false);
        }
    },[token])

  return (
      <form onSubmit={placeOrder} className='place-order'>
          <div className="place-order-left">
              <p className="title">
                  Delivery Information
              </p>
              <div className="multi-fields">
                  <input name="firstName" required onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                  <input name="lastName" required onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
              </div>
              <input name="email" required onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
              <input name="street" required onChange={onChangeHandler} value={data.street} type="text" placeholder='Door No, Street' />
              <div className="multi-fields">
                  <input name="city" required onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                  <input name="state" required onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
              </div>
              <div className="multi-fields">
                  <input name="pinCode" required onChange={onChangeHandler} value={data.pinCode} type="text" placeholder='PIN Code' />
                  <input name="country" required onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' disabled />
              </div>
              <input name='phone' required onChange={onChangeHandler} value={data.phone} type="text" placeholder='Mobile Number' />
          </div>
          <div className="place-order-right">
            <div className="cart-bottom">
                <div className="cart-total">
                <h2>Cart Summary</h2>
                <div className="cart-total-details">
                    <p>Subtotal</p>
                    <p>₹{getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                    <p>Delivery Fee</p>
                    <p>₹{getTotalCartAmount()===0 ? '0' : '25'}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                    <b>TO PAY</b>
                    <b>₹{getTotalCartAmount()===0 ? '0' :getTotalCartAmount()+20}</b>
                </div>
                </div>
                <div className="checkout-btn">
                <button type='submit'>PROCEED TO PAYMENT</button>
                </div>
            </div>
          </div>
      </form>
  )
}
