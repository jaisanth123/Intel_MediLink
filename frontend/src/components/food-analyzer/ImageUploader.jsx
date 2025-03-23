import { useState, useRef, useEffect } from "react";
import { Upload, Camera, X } from "lucide-react";

const ImageUploader = ({ onImageSelected }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Clean up camera stream when component unmounts or when modal is closed
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // When video element is created and stream is available, connect them
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showCamera]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelected(file, reader.result);
          closeModal();
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("Failed to read the image file. Please try another image.");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process the image. Please try again.");
      }
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = null;
  };

  const openModal = () => {
    setShowModal(true);
    setCameraError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowCamera(false);
    stopCameraStream();
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setShowCamera(true);

      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      console.log("Camera access granted:", mediaStream);
      setStream(mediaStream);

      if (videoRef.current) {
        console.log("Setting video source");
        videoRef.current.srcObject = mediaStream;
        // Ensure video loads and plays
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current.play().catch((e) => {
            console.error("Error playing video:", e);
            setCameraError("Could not play video stream");
          });
        };
      } else {
        console.error("Video reference is not available");
        setCameraError("Camera component not initialized");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(`Could not access the camera: ${error.message}`);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) {
      console.error("Video reference not available when taking photo");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      if (!width || !height) {
        console.error("Video dimensions not available:", width, height);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Draw the current video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas");
            return;
          }

          const file = new File([blob], "camera-photo.jpg", {
            type: "image/jpeg",
          });
          const imageUrl = URL.createObjectURL(blob);

          onImageSelected(file, imageUrl);
          closeModal();
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to capture photo. Please try again.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div
        className="flex items-center justify-center p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        onClick={openModal}
        title="Upload food image"
      >
        <Upload size={18} className="mr-2" />
        <span className="hidden sm:inline">Upload Image</span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="fixed inset-0 transform transition-all
         duration-500 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4">
            {!showCamera ? (
              <>
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Select Image Source
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={startCamera}
                  >
                    <Camera size={48} className="text-teal-500 mb-2" />
                    <span className="font-medium text-gray-700">
                      Use Camera
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Take a photo with your device
                    </span>
                  </div>

                  <div
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={triggerFileInput}
                  >
                    <Upload size={48} className="text-teal-500 mb-2" />
                    <span className="font-medium text-gray-700">
                      Upload Image
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Select from your device
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Camera View */}
                <div className="relative bg-black">
                  {cameraError ? (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                      <div className="text-center p-4">
                        <div className="text-red-500 mb-2">Camera Error</div>
                        <p className="text-sm text-gray-600">{cameraError}</p>
                        <button
                          onClick={() => setShowCamera(false)}
                          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                  )}

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={closeModal}
                      className="p-2 bg-gray-800 bg-opacity-70 rounded-full text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Camera Footer */}
                <div className="p-4 flex justify-center">
                  {!cameraError && (
                    <button
                      onClick={takePhoto}
                      className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      Take Photo
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
