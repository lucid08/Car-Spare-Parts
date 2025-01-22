import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const handleDecrement = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const id = productId._id === undefined ? productId : productId._id;

      const response = await axios.patch(
        "http://localhost:8000/api/v1/cart/decrement-item",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cart items and total price with the response data
      setCartItems(response.data.cart.items);
      setTotalPrice(response.data.cart.totalPrice);
    } catch (error) {
      console.error("Error decrementing item quantity:", error);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/v1/cart/get-cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems(response.data.items);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/v1/cart/checkout",
        { shippingAddress }, // Sending shippingAddress as part of the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Order placed successfully!");
        // Optionally clear the cart items and update total price
        setCartItems([]);
        setTotalPrice(0);
        setIsModalOpen(false); // Close the modal after checkout
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        error.response?.data?.message || "Something went wrong during checkout."
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li
              key={item._id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDecrement(item.product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Decrement
                </button>
              </div>
            </li>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-xl font-semibold">
              Total: ${totalPrice.toFixed(2)}
            </h2>
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal on checkout
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
            >
              Checkout
            </button>
          </div>
        </ul>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}

      {/* Address Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Your Address</h2>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 