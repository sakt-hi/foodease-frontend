import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import dayjs from 'dayjs'; // You can use dayjs for date manipulation

const MyOrders = () => {

    const { token, url } = useContext(StoreContext);
    const [orderData, setOrderData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userOrders", {}, { headers: { token } });
        setOrderData(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    },[token])

    // Date categorization logic
    const categorizeOrders = () => {
        const today = dayjs().startOf('day');
        const yesterday = dayjs().subtract(1, 'day').startOf('day');
        const last30Days = dayjs().subtract(30, 'day').startOf('day');

        const todayOrders = [];
        const yesterdayOrders = [];
        const last30DaysOrders = [];
        const previousOrders = [];

        orderData.forEach(order => {
            const orderDate = dayjs(order.date);
            if (orderDate.isSame(today, 'day')) {
                todayOrders.push(order);
            } else if (orderDate.isSame(yesterday, 'day')) {
                yesterdayOrders.push(order);
            } else if (orderDate.isAfter(last30Days)) {
                last30DaysOrders.push(order);
            } else {
                previousOrders.push(order);
            }
        });

        return { todayOrders, yesterdayOrders, last30DaysOrders, previousOrders };
    }

    const { todayOrders, yesterdayOrders, last30DaysOrders, previousOrders } = categorizeOrders();

    const renderOrders = (orders) => {
        return orders.map((order, index) => (
            <div key={order._id} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item, index) => {
                    return index === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `;
                })}</p>
                <p>₹{order.amount}.00</p>
                <p>Total Items: {order.items.length}</p>
                <p><span style={{ color: order.status === "Out for Delivery" ? "tomato" : order.status === "Delivered" ? "#00b45b" : "orange" }}>&#x25cf;</span> <b>{order.status}</b></p>
                {order.status !== "Delivered" && order.status !== "Cancelled" && <button onClick={fetchOrders}>Track Order</button>}
            </div>
        ));
    };

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {todayOrders.length > 0 && (
                    <>
                        <p>Today</p>
                        {renderOrders(todayOrders)}
                    </>
                )}
                {yesterdayOrders.length > 0 && (
                    <>
                        <p>Yesterday</p>
                        {renderOrders(yesterdayOrders)}
                    </>
                )}
                {last30DaysOrders.length > 0 && (
                    <>
                        <p>Last 30 Days</p>
                        {renderOrders(last30DaysOrders)}
                    </>
                )}
                {previousOrders.length > 0 && (
                    <>
                        <p>Previous Orders</p>
                        {renderOrders(previousOrders)}
                    </>
                )}
            </div>
        </div>
    )
}

export default MyOrders;