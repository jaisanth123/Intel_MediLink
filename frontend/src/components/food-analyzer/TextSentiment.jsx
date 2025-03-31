import { useState, useEffect, useRef } from "react";

const TextSentiment = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  // Refs for speech recognition
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setRecordingError("Speech recognition is not supported in your browser.");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setInputText(transcript);
      setCharacterCount(transcript.length);
    };

    recognitionRef.current.onerror = (event) => {
      setRecordingError(`Error occurred in recognition: ${event.error}`);
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle text input change
  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  // Handle start/stop recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setRecordingError("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Handle key press for Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyzeSentiment();
    }
  };

  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://cricket-romantic-slightly.ngrok-free.app/text-sentiment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Clear all inputs and results
  const handleClear = () => {
    setInputText("");
    setResult(null);
    setError("");
    setCharacterCount(0);
    textareaRef.current.focus();
  };

  // Helper function to determine background color based on sentiment
  const getSentimentColor = () => {
    if (!result) return "bg-gray-100";

    const compound = result.sentiment_scores.compound;
    if (compound >= 0.5)
      return "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200";
    if (compound > 0 && compound < 0.5)
      return "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200";
    if (compound === 0)
      return "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200";
    if (compound > -0.5)
      return "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200";
    return "bg-gradient-to-br from-red-50 to-rose-100 border-red-200";
  };

  // Helper function to determine text color based on sentiment
  const getSentimentTextColor = () => {
    if (!result) return "text-gray-800";

    const compound = result.sentiment_scores.compound;
    if (compound >= 0.5) return "text-emerald-700";
    if (compound > 0 && compound < 0.5) return "text-sky-700";
    if (compound === 0) return "text-slate-700";
    if (compound > -0.5) return "text-amber-700";
    return "text-rose-700";
  };

  // Function to determine emoji based on sentiment
  const getSentimentEmoji = () => {
    if (!result) return "😐";

    const compound = result.sentiment_scores.compound;
    if (compound >= 0.5) return "😄";
    if (compound > 0 && compound < 0.5) return "🙂";
    if (compound === 0) return "😐";
    if (compound > -0.5) return "😕";
    return "😞";
  };

  // Function to render sentiment score bars
  const renderScoreBar = (label, score, color, bgColor = "bg-gray-200") => {
    const percentage = Math.round(score * 100);

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
        <div className={`w-full ${bgColor} rounded-full h-3 overflow-hidden`}>
          <div
            className={`h-3 rounded-full ${color} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Emotion Analyzer
                </h1>
                <p className="text-indigo-100 mt-1">
                  Understand the emotional tone behind your text
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Input Section */}
            <div className="mb-8">
              <div className="relative">
                <div className="mb-2 flex justify-between items-center">
                  <label
                    htmlFor="text-input"
                    className="text-sm font-medium text-gray-700"
                  >
                    How are you feeling today?
                  </label>
                  <span
                    className={`text-xs ${
                      characterCount > 0 ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {characterCount} characters
                  </span>
                </div>

                <textarea
                  id="text-input"
                  ref={textareaRef}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm text-gray-800"
                  rows="5"
                  placeholder="Type your thoughts here or use voice input..."
                  value={inputText}
                  onChange={handleTextChange}
                  onKeyPress={handleKeyPress}
                ></textarea>

                <button
                  className={`absolute right-3 bottom-3 p-2.5 rounded-full ${
                    isRecording
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRecording ? "focus:ring-red-500" : "focus:ring-gray-500"
                  }`}
                  onClick={toggleRecording}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {recordingError && (
                <div className="mt-2 flex items-center text-amber-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm">{recordingError}</p>
                </div>
              )}

              {error && (
                <div className="mt-2 flex items-center text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Press Enter to analyze or use the buttons below
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={analyzeSentiment}
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Sentiment"
                  )}
                </button>

                <button
                  onClick={handleClear}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                  title="Clear input and results"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {isRecording && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center animate-pulse">
                <div className="relative mr-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full absolute top-0 left-0 animate-ping opacity-75"></div>
                </div>
                <p className="text-red-600 font-medium">
                  Recording... Speak now
                </p>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div
                id="results-section"
                className={`rounded-xl border p-6 ${getSentimentColor()} transition-all duration-500 ease-in-out`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Analysis Results
                  </h2>
                  <div
                    className={`px-4 py-2 rounded-full font-bold ${getSentimentTextColor()} bg-white shadow-md flex items-center space-x-2`}
                  >
                    <span className="text-2xl">{getSentimentEmoji()}</span>
                    <span>{result.sentiment}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Sentiment Breakdown
                    </h3>
                    {renderScoreBar(
                      "Positive",
                      result.sentiment_scores.positive,
                      "bg-emerald-500",
                      "bg-emerald-100"
                    )}
                    {renderScoreBar(
                      "Neutral",
                      result.sentiment_scores.neutral,
                      "bg-sky-500",
                      "bg-sky-100"
                    )}
                    {renderScoreBar(
                      "Negative",
                      result.sentiment_scores.negative,
                      "bg-rose-500",
                      "bg-rose-100"
                    )}
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-lg">
                        <div className="text-center">
                          <div className="text-4xl font-bold">
                            <span className={getSentimentTextColor()}>
                              {(result.sentiment_scores.compound * 100).toFixed(
                                0
                              )}
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            Compound Score
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-2xl">
                        {getSentimentEmoji()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Analysis Explanation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center space-x-2 text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Start New Analysis</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="text-xs text-center text-gray-500">
              Your data is analyzed on our secure servers and not stored after
              processing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSentiment;
