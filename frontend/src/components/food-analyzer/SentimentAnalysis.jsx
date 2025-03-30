import { useState, useRef } from "react";
import axios from "axios";

const SentimentAnalysis = () => {
  // Update backend URL to point to ngrok URL
  // const BACKEND_URL = "http://localhost:8000";
  const BACKEND_URL = "https://cricket-romantic-slightly.ngrok-free.app"; // Update this to your ngrok URL

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Supported audio formats matching the ffbackend
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

    // Create form data to send file - FastAPI expects multipart/form-data with "file" field
    const formData = new FormData();
    formData.append("file", file); // FastAPI expects "file" as the field name

    console.log("Sending file:", file.name, file.type, file.size);

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
            console.log("Upload progress:", percentCompleted);
            setUploadProgress(percentCompleted);
          },
          timeout: 120000, // 120 seconds - audio processing might take time
        }
      );

      console.log("Response received:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Error processing audio:", err);
      let errorMsg = "Failed to process audio.";

      if (err.response) {
        errorMsg = `Server error (${err.response.status}): ${
          err.response.data.detail || "Unknown error"
        }`;
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        errorMsg =
          "No response from server. Check if your backend is running and accessible.";
        console.error("No response received:", err.request);
      } else {
        errorMsg = `Request error: ${err.message}`;
        console.error("Request error:", err.message);
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Function to get color based on sentiment
  const getSentimentColor = (sentiment) => {
    if (sentiment === "Positive") return "text-green-600";
    if (sentiment === "Negative") return "text-red-600";
    return "text-yellow-600"; // Neutral
  };

  // Function to create progress bars for sentiment scores
  const renderScoreBar = (score, color) => {
    const percentage = score * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Generate the accept attribute for file input
  const acceptAttribute = supportedFormats
    .map((ext) => `${ext},audio/${ext.substring(1)},video/${ext.substring(1)}`)
    .join(",");

  return (
    <div className="max-w-2xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Audio Sentiment Analysis
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Upload Audio File ({supportedFormats.join(", ")})
          </label>
          <div className="flex items-center">
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
              className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded border border-blue-300 transition"
            >
              Choose File
            </label>
            <span className="ml-3 text-gray-600">
              {fileName || "No file selected"}
            </span>
          </div>
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              File type: {file.type}, Size:{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full py-2 px-4 rounded font-medium ${
            isLoading || !file
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition`}
        >
          {isLoading ? "Processing Audio..." : "Analyze Sentiment"}
        </button>

        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>

      {isLoading && (
        <div className="text-center my-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Processing your audio...</p>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="h-2.5 rounded-full bg-blue-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Upload: {uploadProgress}%</p>
            </div>
          )}
          {uploadProgress === 100 && (
            <p className="mt-2 text-sm text-gray-500">
              Upload complete. Now processing with AI models...
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Sentiment:</h3>
            <p
              className={`mt-1 text-lg font-semibold ${getSentimentColor(
                result.sentiment
              )}`}
            >
              {result.sentiment}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">
              Sentiment Scores:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="flex justify-between mb-1">
                  <span>Positive</span>
                  <span className="text-green-600">
                    {(result.sentiment_scores.positive * 100).toFixed(1)}%
                  </span>
                </p>
                {renderScoreBar(
                  result.sentiment_scores.positive,
                  "bg-green-500"
                )}
              </div>
              <div>
                <p className="flex justify-between mb-1">
                  <span>Negative</span>
                  <span className="text-red-600">
                    {(result.sentiment_scores.negative * 100).toFixed(1)}%
                  </span>
                </p>
                {renderScoreBar(result.sentiment_scores.negative, "bg-red-500")}
              </div>
              <div>
                <p className="flex justify-between mb-1">
                  <span>Neutral</span>
                  <span className="text-yellow-600">
                    {(result.sentiment_scores.neutral * 100).toFixed(1)}%
                  </span>
                </p>
                {renderScoreBar(
                  result.sentiment_scores.neutral,
                  "bg-yellow-500"
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Explanation:</h3>
            <p className="mt-1 text-gray-800 bg-white p-3 rounded border border-gray-200">
              {result.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
