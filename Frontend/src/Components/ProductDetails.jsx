import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Access the 'id' from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/v1/product/${id}`
        );
        // console.log(response.data.product.image);
        setProduct(response.data.product);
        
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/");
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Product Details
        </h1>
        {product ? (
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-64 mb-8 rounded-lg"
            />
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-900">Name:</strong> {product.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-900">Price:</strong> ${product.price}
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-900">Stock:</strong>{" "}
              {product.stockQuantity}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                disabled={quantity === 0}
                className="bg-gray-300 px-3 py-2 rounded-l-md hover:bg-gray-400 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-4 py-2 border">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(product.stockQuantity, prev + 1)
                  )
                }
                disabled={quantity === product.stockQuantity}
                className="bg-gray-300 px-3 py-2 rounded-r-md hover:bg-gray-400 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="w-full bg-green-500 text-white px-4 py-3 mt-4 rounded-md font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="text-gray-500 text-center">No product found</div>
        )}
        <button
          onClick={() => window.history.back()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Go Back
        </button>
        
      </div>
    </div>
  );
};

export default ProductDetails;
