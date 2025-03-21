import { useState, useRef, useEffect } from "react";
import { Send, PaperclipIcon, Image } from "lucide-react";
import ImageUploader from "./ImageUploader";
import UserInfoForm from "./UserInfoForm";
import MessageList from "./MessageList";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: "system",
      content:
        "Hello! I'm your Food Analysis Assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userInfo, setUserInfo] = useState({ age: "", gender: "" });
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const messageEndRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Set hasInteracted to true if there are more than the initial system message
    if (messages.length > 1) {
      setHasInteracted(true);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    // User has now interacted with the chat
    setHasInteracted(true);

    // Add user message to chat
    const newUserMessage = {
      type: "user",
      content: inputMessage,
      image: previewUrl,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);
    scrollToBottom();

    try {
      if (selectedImage) {
        // If image is selected, call food-analyze endpoint
        await handleFoodAnalysis();
      } else {
        // Regular chat message
        await handleChatMessage(inputMessage);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleChatMessage = async (message) => {
    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: message,
      });

      if (response.data) {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: response.data.message || "No response received",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  };

  const handleFoodAnalysis = async () => {
    // Only proceed if we have image and required user info
    if (!selectedImage || !userInfo.age || !userInfo.gender) {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "Please provide your age and gender to analyze this food.",
          isWarning: true,
        },
      ]);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("age", userInfo.age);
    formData.append("gender", userInfo.gender);
    formData.append("message", inputMessage); // Additional context from the user

    try {
      setIsUploading(true);

      // Add a processing message
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "Analyzing your food image...",
          isProcessing: true,
        },
      ]);

      const response = await axios.post(
        "http://localhost:5000/api/food-analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Remove the processing message
      setMessages((prev) => prev.filter((msg) => !msg.isProcessing));

      if (response.data.success) {
        // Format and display the food analysis result
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: formatAnalysisResult(response.data.result),
            isAnalysisResult: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: `Could not analyze the image: ${
              response.data.message || "Unknown error"
            }`,
            isError: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error during food analysis:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: `Error analyzing image: ${error.message}`,
          isError: true,
        },
      ]);
    } finally {
      setIsUploading(false);
      resetImageUpload();
    }
  };

  const formatAnalysisResult = (result) => {
    // Placeholder for formatting analysis results
    // In a real implementation, you would format the result nicely based on the response structure
    return `Analysis complete! ${result.text || "No text detected in image."}`;
  };

  const resetImageUpload = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowUploadForm(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (file, preview) => {
    setSelectedImage(file);
    setPreviewUrl(preview);
    setShowUploadForm(true); // Show the form to collect user info
  };

  const handleUserInfoChange = (info) => {
    setUserInfo(info);
  };

  const handleUserInfoSubmit = () => {
    if (!userInfo.age || !userInfo.gender) {
      alert("Please provide both age and gender");
      return;
    }

    // Close the form and focus on the chat input
    setShowUploadForm(false);
    document.getElementById("chatInput").focus();
  };

  return (
    <div
      className="flex flex-col h-screen w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Chat Header */}
      <div className="bg-teal-600 text-white p-4">
        <h1 className="text-xl font-semibold">Food Analysis Assistant</h1>
        <p className="text-sm opacity-80">
          Get personalized insights about your food
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto  p-4 bg-gray-50">
        <MessageList messages={messages} />

        {/* Show prominent uploader when no user interaction yet */}
        {!hasInteracted && !selectedImage && (
          <div
            className=" flex flex-col  items-center justify-center w-1/4 mt-4 py-12 px-4 border-2 border-dashed border-teal-300 rounded-lg bg-teal-50  cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
            style={{ margin: " auto" }}
          >
            <Image size={48} className="text-teal-500 mb-4" />
            <h3 className="text-xl  font-medium text-teal-700 mb-2 text-center">
              Upload a Food Image
            </h3>
            <p className="text-center text-teal-600 mb-4">
              Upload an image of your meal to get personalized nutritional
              insights based on your profile
            </p>
            <ImageUploader
              onImageSelected={handleImageUpload}
              className="hidden" // Hide the default button
            />
          </div>
        )}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 mt-2">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm">Assistant is typing...</p>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Image Upload Form */}
      {showUploadForm && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <UserInfoForm
            userInfo={userInfo}
            onChange={handleUserInfoChange}
            onSubmit={handleUserInfoSubmit}
            previewUrl={previewUrl}
            onRemoveImage={resetImageUpload}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <ImageUploader onImageSelected={handleImageUpload} />

          <div className="flex-1 relative">
            <textarea
              id="chatInput"
              className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Type your message..."
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isUploading}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !selectedImage) || isUploading}
            className={`p-3 rounded-full ${
              (!inputMessage.trim() && !selectedImage) || isUploading
                ? "bg-gray-200 text-gray-400"
                : "bg-teal-600 text-white hover:bg-teal-700"
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
          >
            <Send size={18} />
          </button>
        </div>

        {selectedImage && !showUploadForm && (
          <div className="mt-2 text-sm text-teal-600">
            Image ready to send.{" "}
            {!userInfo.age || !userInfo.gender
              ? "Please provide your age and gender when sending."
              : "Click send to analyze."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
