import { useState } from "react";

const TextSentiment = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine background color based on sentiment
  const getSentimentColor = () => {
    if (!result) return "bg-gray-100";

    const compound = result.sentiment_scores.compound;
    if (compound >= 0.5) return "bg-green-50 border-green-200";
    if (compound > 0 && compound < 0.5) return "bg-blue-50 border-blue-200";
    if (compound === 0) return "bg-gray-50 border-gray-200";
    if (compound > -0.5) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // Helper function to determine text color based on sentiment
  const getSentimentTextColor = () => {
    if (!result) return "text-gray-800";

    const compound = result.sentiment_scores.compound;
    if (compound >= 0.5) return "text-green-700";
    if (compound > 0 && compound < 0.5) return "text-blue-700";
    if (compound === 0) return "text-gray-700";
    if (compound > -0.5) return "text-yellow-700";
    return "text-red-700";
  };

  // Function to render sentiment score bars
  const renderScoreBar = (label, score, color) => {
    const percentage = Math.round(score * 100);

    return (
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mt-10 mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-3xl font-bold text-white">Sentiment Analyzer</h1>
          <p className="text-blue-100 mt-2">
            Enter your text below to analyze the emotional tone
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows="4"
              placeholder="How are you feeling today? Type your thoughts here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              onClick={analyzeSentiment}
              disabled={loading}
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
          </div>

          {result && (
            <div
              className={`rounded-lg border p-6 ${getSentimentColor()} transition-all duration-500 ease-in-out`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Analysis Results
                </h2>
                <div
                  className={`px-4 py-2 rounded-full font-bold ${getSentimentTextColor()} bg-white shadow-sm`}
                >
                  {result.sentiment}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Sentiment Breakdown
                </h3>
                {renderScoreBar(
                  "Positive",
                  result.sentiment_scores.positive,
                  "bg-green-500"
                )}
                {renderScoreBar(
                  "Neutral",
                  result.sentiment_scores.neutral,
                  "bg-blue-500"
                )}
                {renderScoreBar(
                  "Negative",
                  result.sentiment_scores.negative,
                  "bg-red-500"
                )}
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Analysis Explanation
                </h3>
                <p className="text-gray-600">{result.explanation}</p>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="w-48 h-48 rounded-full flex items-center justify-center bg-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">
                      <span className={getSentimentTextColor()}>
                        {(result.sentiment_scores.compound * 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm">Compound Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSentiment;
