import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/product/${category}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error(
          `Error fetching products for category ${category}:`,
          error
        );
      }
    };
    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="ml-32 mr-32">
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          {category} Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-2 shadow-md bg-white hover:shadow-lg transition duration-300"
                style={{ maxWidth: "250px", margin: "auto" }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 object-cover rounded-md mb-1"
                />
                <h3 className="text-md font-bold">{product.title}</h3>
                <p className="text-gray-700 text-sm">{product.description}</p>
                <p className="text-blue-500 font-semibold mt-1 text-sm">
                  ${product.price}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
