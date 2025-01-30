import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashBoard from "./DashBoard"; // Import DashBoard component

const categories = ["Engine", "Tires", "Electronics", "Brakes", "Accessories"];

const Home = () => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = {};
      for (const category of categories) {
        try {
          const response = await axios.post(
            `http://localhost:8000/api/v1/product/home/${category}`
          );
          allProducts[category] = response.data;
        } catch (error) {
          console.error(`Error fetching products for ${category}:`, error);
        }
      }
      setProducts(allProducts);
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">


      {/* Main Content */}
      <div className="lg:w-3/4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Car Spare Products
        </h1>
        {categories.map((category) => (
          <section key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              <Link
                to={`/category/${category}`}
                className="text-blue-500 hover:underline"
              >
                {category}
              </Link>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products[category]?.length > 0 ? (
                products[category].map((product) => {
                  // Ensure the image URL is correct
                  const imageUrl = product.image;
                  console.log(imageUrl);
                  
                  
                  return (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      className="block border rounded-lg p-4 shadow-lg bg-white hover:shadow-xl transition duration-300 cursor-pointer"
                    >
                      <img
                        src={imageUrl} // Use the correct image URL
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                      <h3 className="text-lg font-bold text-gray-800">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {product.description}
                      </p>
                      <p className="text-blue-500 font-semibold mt-2">
                        ${product.price}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500">No products available.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Home;
