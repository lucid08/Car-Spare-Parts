import React, { useState } from "react";
import axios from "axios";

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    stockQuantity: "",
    category: "",
  });
  const [image, setImage] = useState(null); // For file upload

  // Assuming the token is stored in localStorage after login
  const token = localStorage.getItem("token"); // Or use another method to get the token
  console.log(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    
    setImage(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Debug log the image before appending
      console.log("Selected Image:", image);
  
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("stockQuantity", formData.stockQuantity);
      data.append("category", formData.category);
  
      // Append image only if a file is selected
      if (image) {
        data.append("image", image);
      }
  
      // Debug log the FormData entries
      for (let pair of data.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
  
      const response = await axios.post(
        "http://localhost:8000/api/v1/product/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );
  
      console.log("Product created:", response.data);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="md:w-[350px] lg:w-[400px] md:ml-96 mt-8 lg:ml-[600px] rounded-xl shadow-lg p-4 space-y-4 bg-white"
    >
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
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*" // Accept only image files
          onChange={handleImageChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="bg-blue-500 rounded-md hover:scale-105 hover:bg-blue-700 text-white px-4 py-2"
        >
          Create Product
        </button>
      </div>
    </form>
  );
};

export default CreateProductPage;
