import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit2, Save, X, AlertCircle } from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setEditedUser(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load profile");
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setError("");
  };

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        editedUser,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUser(response.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-500 to-teal-600">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-white text-teal-600 rounded-lg shadow hover:bg-teal-50 transition-colors"
              >
                <Edit2 size={18} className="mr-2" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center"
            >
              <AlertCircle size={16} className="mr-2" />
              {error}
            </motion.div>
          )}

          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg"
            >
              Profile updated successfully!
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? editedUser.name : user.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={isEditing ? editedUser.address : user.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={isEditing ? editedUser.gender : user.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    isEditing
                      ? "border-teal-500 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;