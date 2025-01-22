import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
    //   dispatch(setLoading(true));
      const res = await axios.post(`http://localhost:8000/api/v1/user/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.success) {
        // dispatch(setUser(res.data.user));
        navigate("/");
        // toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //   dispatch(setLoading(false));
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
    <div className="bg-gray-200 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mt-3 mb-2">
          Login to Your Account
        </h2>
        <p className="text-center text-md text-gray-600 mt-5 mb-2">
          Welcome to Car Spare
        </p>
        <form onSubmit={submitHandler} className="mt-6">
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
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:bg-blue-700 hover:scale-102"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
