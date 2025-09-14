import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const UpdateProfile = () => {
  const { id } = useParams(); // userId from route params
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");

  // Load existing user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/userProfile/${id}`);
        setBio(res.data.bio || "");
        setProfilePicture(res.data.profilePicture || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:3000/updateuser/${id}`, {
      bio,
      profilePicture,
    });

    setMessage("Profile updated successfully ✅");
    setTimeout(() => navigate(`/profile/${id}`), 1200);
  } catch (err) {
    console.error("Error updating user:", err);
    setMessage("Failed to update profile ❌");
  }
};


  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Write something about yourself..."
            />
          </div>

          <div>
            <label className="block text-gray-700">Profile Picture URL</label>
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Enter image URL"
            />
          </div>

          {profilePicture && (
            <div className="flex justify-center">
              <img
                src={profilePicture}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
