import { X } from "lucide-react";

const UserInfoForm = ({
  userInfo,
  onChange,
  onSubmit,
  previewUrl,
  onRemoveImage,
}) => {
  const handleChange = (e) => {
    onChange({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-teal-800">
          Health Information
        </h3>
        <button
          onClick={onRemoveImage}
          className="text-gray-400 hover:text-gray-600"
          title="Cancel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Food preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age*
            </label>
            <input
              type="number"
              name="age"
              value={userInfo.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your age"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender*
            </label>
            <select
              name="gender"
              value={userInfo.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      {/* 
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={!userInfo.age || !userInfo.gender}
          className={`px-4 py-2 rounded ${
            !userInfo.age || !userInfo.gender
              ? "bg-gray-200 text-gray-500"
              : "bg-teal-600 text-white hover:bg-teal-700"
          } focus:outline-none focus:ring-2 focus:ring-teal-500`}
        >
          Confirm
        </button>
      </div> */}
    </div>
  );
};

export default UserInfoForm;
