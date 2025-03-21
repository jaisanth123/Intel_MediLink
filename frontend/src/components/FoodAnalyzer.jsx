// File: src/pages/FoodAnalyzer.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Upload,
  Image,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import axios from "axios";

const FoodAnalyzer = () => {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const fileInputRef = useRef(null);

  const [healthInfo, setHealthInfo] = useState({
    age: "",
    gender: "",
    conditions: "",
    allergies: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleHealthInfoChange = (e) => {
    setHealthInfo({
      ...healthInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (step === 1 && !previewUrl) return;
    if (step === 2 && (!healthInfo.age || !healthInfo.gender)) return;

    if (step === 3) {
      handleAnalyzeFood();
      return;
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleAnalyzeFood = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);

    setAnalyzing(true);

    try {
      console.log("Sending image for analysis:", selectedImage);
      const response = await axios.post(
        "http://localhost:5000/api/food-analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.data.success) {
        setOcrResult(response.data.result.text || "No text detected");
      } else {
        setOcrResult(`Error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during OCR:", error);
      console.error(
        "Error details:",
        error.response?.data || "No response data"
      );
      setOcrResult(
        `Error during OCR: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setAnalyzing(false);
    }
  };
  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
              Upload Food Image
            </h2>
            <p className="text-gray-600 text-center">
              Upload a clear image of the food or its ingredients to analyze
            </p>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="mx-auto max-h-64 rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Upload size={32} className="text-gray-500" />
                  </div>
                  <p className="text-gray-700">
                    Drag & drop an image here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports JPG, PNG and WEBP files
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
              Health Information
            </h2>
            <p className="text-gray-600 text-center">
              Provide your health details for personalized food recommendations
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age*
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={healthInfo.age}
                    onChange={handleHealthInfoChange}
                    className="form-input"
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender*
                  </label>
                  <select
                    name="gender"
                    required
                    value={healthInfo.gender}
                    onChange={handleHealthInfoChange}
                    className="form-input"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Conditions
                </label>
                <textarea
                  name="conditions"
                  value={healthInfo.conditions}
                  onChange={handleHealthInfoChange}
                  rows="3"
                  className="form-input"
                  placeholder="List any health conditions you have (e.g., diabetes, hypertension)"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={healthInfo.allergies}
                  onChange={handleHealthInfoChange}
                  rows="2"
                  className="form-input"
                  placeholder="List any food allergies you have"
                ></textarea>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
              Confirm Analysis
            </h2>
            <p className="text-gray-600 text-center">
              Review your information before analysis
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Food Image</h3>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="max-h-40 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Health Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p>{healthInfo.age}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p>{healthInfo.gender}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">Health Conditions</p>
                  <p>{healthInfo.conditions || "None provided"}</p>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">Allergies</p>
                  <p>{healthInfo.allergies || "None provided"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
              Analysis Results
            </h2>

            {analysisResult && (
              <div className="space-y-6">
                <div
                  className={`text-center p-4 rounded-lg ${
                    analysisResult.suitability === "suitable"
                      ? "bg-green-50 border border-green-200"
                      : analysisResult.suitability === "caution"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {analysisResult.suitability === "suitable" ? (
                      <CheckCircle size={40} className="text-green-500" />
                    ) : analysisResult.suitability === "caution" ? (
                      <AlertCircle size={40} className="text-yellow-500" />
                    ) : (
                      <XCircle size={40} className="text-red-500" />
                    )}
                  </div>
                  <h3
                    className={`font-bold text-lg ${
                      analysisResult.suitability === "suitable"
                        ? "text-green-800"
                        : analysisResult.suitability === "caution"
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {analysisResult.suitability === "suitable"
                      ? "Safe to Consume"
                      : analysisResult.suitability === "caution"
                      ? "Consume with Caution"
                      : "Not Recommended"}
                  </h3>
                  <p
                    className={`mt-1 ${
                      analysisResult.suitability === "suitable"
                        ? "text-green-700"
                        : analysisResult.suitability === "caution"
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {analysisResult.healthSuggestions}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-4">
                    <h3 className="font-semibold mb-2">Food Information</h3>
                    <p className="text-lg font-medium mb-4">
                      {analysisResult.foodName}
                    </p>

                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysisResult.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Nutritional Info (per serving)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="font-medium">
                          {analysisResult.nutritionalInfo.calories} kcal
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Protein</p>
                        <p className="font-medium">
                          {analysisResult.nutritionalInfo.protein}g
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="font-medium">
                          {analysisResult.nutritionalInfo.carbs}g
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Fat</p>
                        <p className="font-medium">
                          {analysisResult.nutritionalInfo.fat}g
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4">
                    <h3 className="font-semibold mb-2">Health Impact</h3>

                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Benefits
                    </h4>
                    <ul className="space-y-1 mb-4">
                      {analysisResult.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Warnings
                    </h4>
                    {analysisResult.warnings.length > 0 ? (
                      <ul className="space-y-1">
                        {analysisResult.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle
                              size={16}
                              className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-sm">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No specific warnings for your health conditions.
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button onClick={resetAnalysis} className="btn-primary">
                    Analyze Another Food
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
          <Utensils size={24} />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Food Analyzer</h1>
          <p className="text-gray-600">
            Find out if a food is suitable for your health
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 ${
                    step === stepNumber
                      ? "bg-teal-600 text-white"
                      : step > stepNumber
                      ? "bg-teal-100 text-teal-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {stepNumber === 1 ? (
                    <Image size={18} />
                  ) : stepNumber === 2 ? (
                    <User size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {stepNumber === 1
                    ? "Upload"
                    : stepNumber === 2
                    ? "Health Info"
                    : "Confirm"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-teal-600 transition-all"
              style={{ width: `${Math.min(100, ((step - 1) / 2) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6"
      >
        {analyzing ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-teal-600 border-r-teal-600 border-gray-200 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium">Analyzing Your Food</h3>
            <p className="text-gray-500 mt-2">
              Please wait while we process your information...
            </p>
          </div>
        ) : (
          renderStepContent()
        )}

        {step < 4 && !analyzing && (
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={handlePrevStep}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNextStep}
              disabled={
                (step === 1 && !previewUrl) ||
                (step === 2 && (!healthInfo.age || !healthInfo.gender))
              }
              className={`btn-primary ${
                (step === 1 && !previewUrl) ||
                (step === 2 && (!healthInfo.age || !healthInfo.gender))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {step === 3 ? "Analyze Food" : "Next"}
            </button>
          </div>
        )}
      </motion.div>

      {ocrResult && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">OCR Result</h2>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  );
};

export default FoodAnalyzer;
