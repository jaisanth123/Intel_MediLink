import { useState, useRef } from "react";
import axios from "axios";
import TextSentiment from "./TextSentiment";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileAudio,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  Stethoscope,
  BarChart4,
} from "lucide-react";

import { CiWavePulse1 } from "react-icons/ci";

import Lottie from "react-lottie";
import medicalAnimationData from "../../assets/medical.json"; // You'll need to create/download this

const SentimentAnalysis = () => {
  // Update backend URL to point to ngrok URL
  const BACKEND_URL = "https://cricket-romantic-slightly.ngrok-free.app";

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Supported audio formats matching the backend
  const supportedFormats = [
    ".wav",
    ".mp3",
    ".mp4",
    ".m4a",
    ".m4p",
    ".aac",
    ".ogg",
    ".flac",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file has a supported extension
      const fileExt = "." + selectedFile.name.split(".").pop().toLowerCase();
      if (!supportedFormats.includes(fileExt)) {
        setError(
          `Unsupported file format. Supported formats: ${supportedFormats.join(
            ", "
          )}`
        );
        setFile(null);
        setFileName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      console.log("File selected:", selectedFile);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError("");
    setUploadProgress(0);

    // Create form data to send file
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/process-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
          timeout: 120000, // 120 seconds - audio processing might take time
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("Error processing audio:", err);
      let errorMsg = "Failed to process audio.";

      if (err.response) {
        errorMsg = `Server error (${err.response.status}): ${
          err.response.data.detail || "Unknown error"
        }`;
      } else if (err.request) {
        errorMsg =
          "No response from server. Check if your backend is running and accessible.";
      } else {
        errorMsg = `Request error: ${err.message}`;
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Function to get color based on sentiment
  const getSentimentColor = (sentiment) => {
    if (sentiment === "Positive") return "text-teal-600";
    if (sentiment === "Negative") return "text-red-600";
    return "text-amber-600"; // Neutral
  };

  // Function to create progress bars for sentiment scores
  const renderScoreBar = (score, color) => {
    const percentage = score * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          className={`h-3 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    );
  };

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: medicalAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Generate the accept attribute for file input
  const acceptAttribute = supportedFormats
    .map((ext) => `${ext},audio/${ext.substring(1)},video/${ext.substring(1)}`)
    .join(",");

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-t-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-white">
          <div className="flex items-center">
            <Stethoscope size={36} className="mr-4" />
            <h1 className="text-3xl font-bold">Medical Voice Analysis</h1>
          </div>
          <p className="mt-2 opacity-90">
            Upload audio recordings for AI-powered sentiment and emotional
            analysis
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-b-2xl shadow-xl p-8 mb-8"
      >
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-3">
              Upload Voice Recording
            </label>

            <motion.div
              className="border-2 border-dashed border-teal-200 rounded-xl p-8 bg-teal-50 text-center"
              whileHover={{ scale: 1.01, borderColor: "#0d9488" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="file"
                accept={acceptAttribute}
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
                ref={fileInputRef}
              />

              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="bg-teal-100 p-4 rounded-full mb-4">
                  <FileAudio size={40} className="text-teal-600" />
                </div>
                <span className="text-teal-800 font-medium mb-2">
                  {file ? "Change File" : "Select Audio File"}
                </span>
                <span className="text-sm text-teal-600">
                  {supportedFormats.join(", ")} formats supported
                </span>
              </label>

              {file && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-left bg-white p-4 rounded-lg shadow-sm inline-block"
                >
                  <div className="flex items-center">
                    <CiWavePulse1 size={24} className="text-teal-600 mr-2" />
                    <span className="font-medium text-gray-800">
                      {fileName}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    File type: {file.type || "audio"}, Size:{" "}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </motion.div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 flex items-start p-3 bg-red-50 text-red-700 rounded-lg"
              >
                <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !file}
            className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center ${
              isLoading || !file
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg"
            } transition`}
            whileHover={{ scale: !isLoading && file ? 1.02 : 1 }}
            whileTap={{ scale: !isLoading && file ? 0.98 : 1 }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Processing Audio...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2" />
                Analyze Voice Recording
              </>
            )}
          </motion.button>
        </form>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="my-8"
            >
              <div className="flex justify-center mb-4">
                <div className="w-80 h-80">
                  <Lottie options={defaultOptions} />
                </div>
              </div>

              <p className="text-center font-medium text-teal-700 mb-4">
                {uploadProgress === 100
                  ? "Processing with medical AI models..."
                  : "Uploading audio recording..."}
              </p>

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  ></motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-8 bg-white border border-teal-100 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-100 to-blue-100 px-6 py-4 border-b border-teal-200">
                <div className="flex items-center">
                  <BarChart4 size={24} className="text-teal-700 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Voice Analysis Results
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Emotional Tone
                    </h3>
                    <div className="flex items-center">
                      <motion.div
                        className={`text-2xl font-bold ${getSentimentColor(
                          result.sentiment
                        )}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {result.sentiment}
                      </motion.div>

                      <motion.div
                        className="ml-auto"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            result.sentiment === "Positive"
                              ? "bg-teal-100 text-teal-600"
                              : result.sentiment === "Negative"
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {result.sentiment === "Positive" ? (
                            <CheckCircle size={24} />
                          ) : result.sentiment === "Negative" ? (
                            <AlertCircle size={24} />
                          ) : (
                            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Sentiment Intensity
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-8 w-2 rounded-full ${
                            // Determine color and height based on sentiment scores
                            i <
                            Math.floor(result.sentiment_scores.positive * 10)
                              ? "bg-teal-500"
                              : i <
                                Math.floor(
                                  (result.sentiment_scores.positive +
                                    result.sentiment_scores.neutral) *
                                    10
                                )
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          initial={{ height: 4 }}
                          animate={{ height: 8 + (i % 3) * 12 }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                        ></motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h3 className="font-medium text-gray-700 mb-4">
                    Emotional Spectrum Analysis
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-teal-700">
                          Positive
                        </span>
                        <span className="font-medium text-teal-700">
                          {(result.sentiment_scores.positive * 100).toFixed(1)}%
                        </span>
                      </div>
                      {renderScoreBar(
                        result.sentiment_scores.positive,
                        "bg-teal-500"
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-amber-600">
                          Neutral
                        </span>
                        <span className="font-medium text-amber-600">
                          {(result.sentiment_scores.neutral * 100).toFixed(1)}%
                        </span>
                      </div>
                      {renderScoreBar(
                        result.sentiment_scores.neutral,
                        "bg-amber-500"
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-red-600">
                          Negative
                        </span>
                        <span className="font-medium text-red-600">
                          {(result.sentiment_scores.negative * 100).toFixed(1)}%
                        </span>
                      </div>
                      {renderScoreBar(
                        result.sentiment_scores.negative,
                        "bg-red-500"
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <h3 className="font-medium text-teal-800 mb-3">
                    Clinical Interpretation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <TextSentiment />
    </div>
  );
};

export default SentimentAnalysis;
