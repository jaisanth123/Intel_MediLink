import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle2,
  CheckCircle2,
  XCircle,
  Camera,
  MapPin,
  Sparkles,
  ChevronDown,
  Star,
  Award,
  Heart,
  Flag,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { BiFemale, BiMale } from "react-icons/bi";
const UserInfoForm = ({
  userInfo,
  onChange,
  onSubmit,
  previewUrl,
  onRemoveImage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState({
    age: false,
    gender: false,
  });

  const genderOptions = [
    {
      value: "male",
      label: "Male",
      icon: BiMale,
      color: "text-blue-500",
    },
    {
      value: "female",
      label: "Female",
      icon: BiFemale,
      color: "text-pink-500",
    },
    {
      value: "other",
      label: "Other",
      icon: Star,
      color: "text-purple-500",
    },
  ];

  const handleChange = (e) => {
    onChange({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderSelect = (gender) => {
    onChange({
      ...userInfo,
      gender,
    });
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-3xl shadow-2xl border-2 border-white"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <Heart className="text-purple-600" size={28} />
          <h3 className="text-2xl font-bold text-purple-900">Health Profile</h3>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemoveImage}
          className="text-gray-500 hover:text-red-500"
          title="Cancel"
        >
          <XCircle size={24} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex space-x-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-32 h-32 relative"
          >
            {previewUrl ? (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={previewUrl}
                alt="Food preview"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-purple-100 rounded-2xl flex items-center justify-center">
                <Camera className="text-purple-500" size={48} />
              </div>
            )}
          </motion.div>

          <div className="flex-1 space-y-4">
            {/* Age Input */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center text-sm font-medium text-purple-800 mb-2">
                <Award className="mr-2" size={16} />
                Age*
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleChange}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, age: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, age: false }))
                  }
                  className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-300 ${
                    isFocused.age
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your age"
                  required
                />
                <Flag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </motion.div>

            {/* Gender Dropdown */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <label className="flex items-center text-sm font-medium text-purple-800 mb-2">
                <Sparkles className="mr-2" size={16} />
                Gender*
              </label>

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
                    isDropdownOpen
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : "border-gray-300"
                  }`}
                >
                  {userInfo.gender ? (
                    <div className="flex items-center">
                      {(() => {
                        const selectedGender = genderOptions.find(
                          (g) => g.value === userInfo.gender
                        );
                        const Icon = selectedGender.icon;
                        return (
                          <>
                            <Icon
                              className={`mr-2 ${selectedGender.color}`}
                              size={20}
                            />
                            {selectedGender.label}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <span className="text-gray-400">Select Gender</span>
                  )}
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border border-purple-100 overflow-hidden"
                    >
                      {genderOptions.map((gender) => (
                        <motion.div
                          key={gender.value}
                          whileHover={{
                            backgroundColor: "rgba(168, 85, 247, 0.1)",
                          }}
                          onClick={() => handleGenderSelect(gender.value)}
                          className="flex items-center p-3 cursor-pointer hover:bg-purple-50 transition-colors"
                        >
                          <gender.icon
                            className={`mr-3 ${gender.color}`}
                            size={20}
                          />
                          <span>{gender.label}</span>
                          <ArrowUpRight
                            className="ml-auto text-purple-400"
                            size={16}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!userInfo.age || !userInfo.gender}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              !userInfo.age || !userInfo.gender
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            <CheckCircle2 size={20} />
            <span>Confirm</span>
            <ArrowRight className="ml-2" size={16} />
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UserInfoForm;
