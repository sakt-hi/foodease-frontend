import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {

    const { token, url } = useContext(StoreContext);
    const [orderData, setOrderData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userOrders", {}, { headers: { token } });
        setOrderData(response.data.data);
        console.log(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    },[token])

  return (
      <div className="my-orders">
          <h2>My Orders</h2>
          <div className="container">
              {orderData.map((order,index) => {
                  return (
                      <div key={order._id} className="my-orders-order">
                          <img src={assets.parcel_icon} alt="" />
                          <p>{order.items.map((item,index) => {
                              if (index === order.items.length - 1) {
                                  return item.name+" x "+item.quantity
                              } else {
                                return item.name+" x "+item.quantity+", "
                              }
                          })} </p>
                          <p>₹{order.amount}.00 </p>
                          <p>Total Items: {order.items.length} </p>
                          <p><span style={{color:order.status === "Out for Delivery" ? "tomato":order.status === "Delivered" ? "#00b45b" :"orange" }} >&#x25cf;</span> <b>{order.status} </b></p>
                          <button onClick={fetchOrders}>Track Order</button>
                      </div>
                  )
              })}
          </div>
    </div>
  )
}

export default MyOrders