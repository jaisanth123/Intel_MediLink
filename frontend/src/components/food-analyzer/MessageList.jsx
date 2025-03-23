import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const MessageList = ({ messages }) => {
  const renderAnalysisResult = (content) => {
    // This is a placeholder - you would format this based on your actual response structure
    return content;
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {/* <div className="text-lg font-medium mb-2">Analysis Results</div> */}
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-3/4 rounded-lg p-4 ${
              message.type === "user"
                ? "bg-teal-600 text-white"
                : message.isError
                ? "bg-red-50 border border-red-200 text-red-700"
                : message.isWarning
                ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                : message.isProcessing
                ? "bg-blue-50 border border-blue-200 text-blue-700"
                : "bg-white border border-gray-200"
            }`}
          >
            {message.isProcessing && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="font-medium">Processing</span>
              </div>
            )}

            {message.image && (
              <div className="mb-2">
                <img
                  src={message.image}
                  alt="Uploaded by user"
                  className="max-h-48 rounded-md"
                />
              </div>
            )}

            {message.isAnalysisResult ? (
              renderAnalysisResult(message.content)
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
