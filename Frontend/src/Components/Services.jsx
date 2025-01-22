import React from "react";

const Services = () => {
  const services = [
    {
      title: "Genuine Spare Parts",
      description:
        "We provide authentic spare parts to ensure your vehicle maintains its original quality and performance.",
      icon: "🚗",
    },
    {
      title: "Wide Product Range",
      description:
        "From engine components to tires and accessories, we offer a comprehensive catalog for all your car needs.",
      icon: "📦",
    },
    {
      title: "Expert Consultation",
      description:
        "Our experts are available to guide you in selecting the perfect parts for your vehicle.",
      icon: "💡",
    },
    {
      title: "Fast Delivery",
      description:
        "Enjoy quick and reliable delivery services, ensuring your parts reach you on time.",
      icon: "🚚",
    },
    {
      title: "Affordable Pricing",
      description:
        "Get premium-quality products at competitive prices without compromising on quality.",
      icon: "💰",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Our Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
