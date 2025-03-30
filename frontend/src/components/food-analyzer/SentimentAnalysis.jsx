import { useState, useRef, useEffect } from "react";
import { Send, Image, CheckCircle, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import UserInfoForm from "./UserInfoForm";
import MessageList from "./MessageList";
import axios from "axios";

const SentimentAnalysis = () => {
  const [messages, setMessages] = useState([
    {
      type: "system",
      content:
        "Hello! I'm your Report Analysis Assistant. How can I help you today?",
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

  // Update backend URL to point to ngrok URL
  // const BACKEND_URL = "http://localhost:8000";
  const BACKEND_URL = "https://cricket-romantic-slightly.ngrok-free.app"; // Update this to your ngrok URL

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Set hasInteracted to true if there are more than the initial system message
    if (messages.length > 1) {
      setHasInteracted(true);
    }
  }, [messages]);

  // Make sure form stays open when hello image is selected
  useEffect(() => {
    if (selectedImage && previewUrl) {
      setShowUploadForm(true);
    }
  }, [selectedImage, previewUrl]);

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
        // If image is selected, call OCR endpoint
        await handleImageOCR();
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
      // Close the upload form after sending message
      setShowUploadForm(false);
      scrollToBottom();
    }
  };

  const handleChatMessage = async (message) => {
    try {
      // Directly use the FastAPI llm-chat endpoint
      const response = await axios.post(`${BACKEND_URL}/health-llm-chat`, {
        message: message,
      });

      // Handle the direct text response instead of JSON
      const responseContent = response.data;

      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content:
            typeof responseContent === "string"
              ? responseContent
              : responseContent.message || "No response received",
        },
      ]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  };

  const handleImageOCR = async () => {
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
    formData.append("file", selectedImage); // Change 'image' to 'file' to match FastAPI parameter
    formData.append("age", userInfo.age);
    formData.append("gender", userInfo.gender);
    formData.append("description", inputMessage); // Use description parameter from FastAPI

    try {
      setIsUploading(true);

      // Directly use the FastAPI OCR endpoint
      const response = await axios.post(`${BACKEND_URL}/health-ocr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the direct text response from the server
      if (typeof response.data === "string") {
        // If response is directly a string
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: response.data,
            isAnalysisResult: true,
          },
        ]);
      } else if (response.data.success) {
        // For backward compatibility with JSON responses
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: formatAnalysisResult(response.data),
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
      console.error("Error during image OCR:", error);
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
    // Format the OCR results including user info and detected text
    if (!result || !result.success) {
      return "Could not analyze the image.";
    }

    const age = result.debug_info?.age || "Not provided";
    const gender = result.debug_info?.gender || "Not provided";
    const text = result.debug_info?.ocr_text || "No text detected in image.";
    const description = result.debug_info?.description || "";

    return `
    Analysis complete!

    User Profile:
    • Age: ${age}
    • Gender: ${gender}

    ${description ? `Description: ${description}\n\n` : ""}

    Text detected in image:
    ${text.trim() ? text.trim() : "No text detected in image."}

    Analysis:
    ${result.response || "No analysis available."}
    `;
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
    if (!file || !preview) {
      console.error("Invalid file or preview URL");
      return;
    }

    // Set state in a single batch to prevent race conditions
    setSelectedImage(file);
    setPreviewUrl(preview);
    setShowUploadForm(false); // Close the form when an image is selected
  };

  const handleUserInfoChange = (info) => {
    setUserInfo(info);
  };

  const handleUserInfoSubmit = () => {
    if (!userInfo.age || !userInfo.gender) {
      alert("Please provide  both age and gender");
      return;
    }

    // Close the form and focus on the chat input
    setShowUploadForm(false); // Ensure the form is closed after submission
    document.getElementById("chatInput").focus();
  };

  return <div></div>;
};

export default SentimentAnalysis;
