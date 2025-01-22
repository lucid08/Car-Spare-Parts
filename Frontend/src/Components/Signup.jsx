import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

// import { useDispatch } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  console.log(input);
  //   const {loading} = useSelector(store => store.auth);
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    if (input.password !== document.getElementById("confirm-password").value) {
      return alert("Passwords do not match");
    }
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    try {
      //   dispatch(setLoading(true));
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response?.data?.message || "Somethi ng went wrong");
    } finally {
      //   dispatch(setLoading(false));
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-200 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mt-3 mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-md text-gray-600 mt-5 mb-2">
            Join Car Spare Today
          </p>
          <form className="mt-6" onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-md font-bold"
              >
                Name
              </label>
              <input
                type="text"
                value={input.fullName}
                name="fullName"
                onChange={changeEventHandler}
                className="w-full mt-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-md font-bold"
              >
                Email
              </label>
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className="w-full mt-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-md font-bold"
              >
                Password
              </label>
              <input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className="w-full mt-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-md font-bold"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full mt-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 text-md font-bold"
              >
                Phone Number
              </label>
              <input
                type="number"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                className="w-full mt-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:bg-blue-700 hover:scale-102"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
