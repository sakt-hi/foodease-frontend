import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

function Cart() {

    const { cartItems, food_list, removeFromCart, addToCart,getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  
  if (getTotalCartAmount() === 0) {
    return (
      <div className="cart">
        <div className="empty-cart">
        <img src={assets.empty_cart} alt="" />
          <h3>Your cart is empty!</h3>
          <p>But it doesn’t have to stay that way. Explore our collection and find something you love.</p>
          <button onClick={()=>navigate('/')} >Explore Now</button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <h2 className="cart-title">Cart Items</h2>
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div key={item._id} className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name} </p>
                  <p>₹{item.price}</p>
                  {/* <p>{cartItems[item._id]} </p> */}
                  <div className="cart-item-counter">
                    <img
                      onClick={() => removeFromCart(item._id)}
                      src={assets.remove_icon_red}
                      alt=""
                    />
                    <p>{cartItems[item._id]} </p>
                    <img
                      onClick={() => addToCart(item._id)}
                      src={assets.add_icon_green}
                      alt=""
                    />
                  </div>
                  <p>₹{item.price * cartItems[item._id]} </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
          </div>
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
            <p>₹{getTotalCartAmount()===0 ? '0' : '20'}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>TO PAY</b>
            <b>₹{getTotalCartAmount()===0 ? '0' :getTotalCartAmount()+20}</b>
          </div>
        </div>
        <div className="cart-promocode">
          <div>
            <p className="have-code">Have a promo code?</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
        <div className="checkout-btn">
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
