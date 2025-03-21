import { useRef } from "react";
import { Upload } from "lucide-react";

const ImageUploader = ({ onImageSelected }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex items-center justify-center p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
      onClick={() => fileInputRef.current.click()}
      title="Upload food image"
    >
      <Upload size={18} className="mr-2" />
      <span>Upload Image</span>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
