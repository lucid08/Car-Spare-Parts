import React from "react";
import { Link } from "react-router-dom";

const DashBoard = () => {

  const handleUpdateProduct = () => {
    console.log("Update Product clicked");
  };

  const handleDeleteProduct = () => {
    console.log("Delete Product clicked");
  };

  return (
    <div className="dashboard bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link to={'/create-product'}>
        <button
          className="w-full bg-green-500 mb-4 text-white px-4 py-3 rounded-md font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition"
        >
          Add Product
        </button>
        </Link>
      </div>
    </div>
  );
};

export default DashBoard;
