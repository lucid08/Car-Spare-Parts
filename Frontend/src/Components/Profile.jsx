import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, [token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            <img
              src={user.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">{user.fullName}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-600 mt-2">{user.bio || "No bio available"}</p>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between text-gray-600">
            <div>
              <h3 className="text-xl font-medium">Location</h3>
              <p>{user.location || "Unknown"}</p>
            </div>
            <div>
              <h3 className="text-xl font-medium">Joined</h3>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
