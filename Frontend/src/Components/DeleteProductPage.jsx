import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteProductPage = () => {
  const { productId } = useParams(); // Get productId from the route
  const navigate = useNavigate(); // To navigate after successful deletion
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(productId);
  

  const deleteProduct = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      setError("Unauthorized: Please log in to delete the product.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/product/delete-product/${productId}`, // Replace with your API URL
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // console.log(response.data.message); // Log success message
      alert("Product deleted successfully!"); // Optional user feedback
      navigate("/"); // Redirect to the homepage or another route
    } catch (err) {
      alert(err.message); // Log error message
      console.error("Error deleting product:", err);
      setError(
        err.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    deleteProduct();
  }, [productId]); // Call deleteProduct when component loads

  return (
    <div className="delete-product-page">
      {loading ? (
        <p>Deleting product...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p>Product deleted successfully.</p>
      )}
    </div>
  );
};

export default DeleteProductPage;
