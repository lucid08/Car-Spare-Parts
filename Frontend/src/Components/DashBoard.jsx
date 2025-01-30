import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

const DashBoard = () => {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products created by the user
  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8000/api/v1/product/user/products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserItems(response.data.products);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load user products on component mount
  useEffect(() => {
    fetchUserProducts();
  }, []);

  const handleUpdateProduct = (id) => {
    console.log(`Update Product clicked for product ID: ${id}`);
    // Add update functionality
  };

  const handleDeleteProduct = async (id) => {
    try {
      console.log(`Delete Product clicked for product ID: ${id}`);
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete the product. Please try again.");
    }
  };

  return (
    <div className="dashboard bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link to="/create-product">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition">
            Add Product
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Your Items
          </h2>
          {userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-md shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                        <span className="text-gray-500">
                          No Image Available
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {item.description}
                    </p>
                    <p className="text-md font-medium text-gray-800 mt-2">
                      Price:{" "}
                      <span className="text-green-600">${item.price}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <NavLink
                      to={`/update-product/${item._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md font-medium hover:bg-blue-600 transition"
                    >
                      Update
                    </NavLink>
                    <NavLink
                      to={`/delete-product/${item._id}`}
                      className="bg-red-500 text-white px-3 py-1 rounded-md font-medium hover:bg-red-600 transition"
                    >
                      Delete
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashBoard;
