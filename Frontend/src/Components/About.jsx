import React from "react";

const About = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">About Us</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to our Car Spare Parts Store, your one-stop solution for high-quality and reliable car components. We are dedicated to providing top-notch spare parts that ensure your vehicle remains in prime condition.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Our mission is to offer an extensive range of products, from essential engine parts to specialized accessories, catering to every need of car enthusiasts and repair professionals alike. With a commitment to excellence, we focus on delivering value, quality, and outstanding customer service.
        </p>
        <p className="text-gray-700 text-lg">
          Whether you are looking to maintain, upgrade, or repair your vehicle, we are here to make the process seamless and hassle-free. Discover a wide selection of premium parts tailored to enhance your car’s performance and safety.
        </p>
      </div>
    </div>
  );
};

export default About;
