import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProductPage = () => {
  const { productId } = useParams();
  console.log(productId);
  const navigate = useNavigate(); // For redirecting user if not authorized
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    stockQuantity: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to be logged in.");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/v1/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const product = response.data.product;
        // console.log(product);
        

        if (!product) {
          setError("Product not found.");
          return;
        }

        // Ensure all fields are populated in the form
        setFormData({
          title: product.title || "",
          price: product.price || "",
          description: product.description || "",
          stockQuantity: product.stockQuantity || "",
          category: product.category || "",
          image: product.image || "",
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `http://localhost:8000/api/v1/product/update-product/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product updated successfully!");
      navigate(`/product/${productId}`); // Redirect to product details page
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="md:w-[350px] lg:w-[400px] md:ml-96 mt-8 lg:ml-[600px] rounded-xl shadow-lg p-4 space-y-4 bg-white"
    >
      <h1 className="text-xl font-bold text-center text-gray-800">
        Update Product
      </h1>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        ></textarea>
      </div>
      <div>
        <label htmlFor="stockQuantity">Stock Quantity</label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Select a category</option>
          <option value="Engine">Engine</option>
          <option value="Tires">Tires</option>
          <option value="Electronics">Electronics</option>
          <option value="Brakes">Brakes</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      <div>
        <label htmlFor="image">Image URL</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="bg-green-500 rounded-md hover:scale-105 hover:bg-green-700 text-white px-4 py-2"
        >
          Update Product
        </button>
      </div>
    </form>
  );
};

export default UpdateProductPage;
