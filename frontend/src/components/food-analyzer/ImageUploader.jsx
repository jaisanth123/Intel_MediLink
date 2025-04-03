import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  X,
  ImagePlus,
  ScanLine,
  Sparkles,
  Focus,
  Layers,
  Palette,
  Info,
} from "lucide-react";

const ImageUploader = ({ onImageSelected }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Existing useEffect hooks remain the same
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showCamera]);

  // All existing methods remain the same
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
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      console.log("Camera access granted:", mediaStream);
      setStream(mediaStream);

      if (videoRef.current) {
        console.log("Setting video source");
        videoRef.current.srcObject = mediaStream;
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

      ctx.drawImage(videoRef.current, 0, 0, width, height);

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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={openModal}
        title="Upload food image"
      >
        <ImagePlus size={18} className="mr-2" />
        <span className="hidden sm:inline">Upload Image</span>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transform transition-all duration-500 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full mx-4 border-2 border-purple-100"
            >
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <div className="flex items-center">
                  <Info className="mr-2" />
                  <span>
                    {" "}
                    For better results, consider uploading photos taken with a
                    document scanner.
                  </span>
                </div>
              </div>

              {!showCamera ? (
                <>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="text-purple-600" size={24} />
                        <h3 className="text-xl font-bold text-purple-900">
                          Choose Image Source
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={closeModal}
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <X size={24} />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startCamera}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <div className="bg-purple-100 p-4 rounded-full mb-3">
                          <Camera size={32} className="text-purple-600" />
                        </div>
                        <span className="font-semibold text-purple-900 mb-1">
                          Use Camera
                        </span>
                        <span className="text-xs text-gray-500 text-center">
                          Capture a fresh photo
                        </span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerFileInput}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <div className="bg-indigo-100 p-4 rounded-full mb-3">
                          <Upload size={32} className="text-indigo-600" />
                        </div>
                        <span className="font-semibold text-purple-900 mb-1">
                          Upload Image
                        </span>
                        <span className="text-xs text-gray-500 text-center">
                          Choose from device
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative bg-black">
                    {cameraError ? (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                        <div className="text-center p-4">
                          <div className="text-red-500 mb-2 flex items-center justify-center">
                            <Focus className="mr-2" /> Camera Error
                          </div>
                          <p className="text-sm text-gray-600">{cameraError}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCamera(false)}
                            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                          >
                            Go Back
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 border-8 border-purple-500/30 pointer-events-none"></div>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={closeModal}
                        className="p-2 bg-black bg-opacity-50 rounded-full text-white"
                      >
                        <X size={20} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 flex justify-center">
                    {!cameraError && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={takePhoto}
                        className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <ScanLine className="mr-2" size={20} />
                        Capture Photo
                      </motion.button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageUploader;
