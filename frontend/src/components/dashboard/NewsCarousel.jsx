import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Clock,
  MapPin,
  Heart,
  ThumbsUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Activity,
  AlertTriangle,
  Stethoscope,
  Pill,
  Thermometer,
  Clipboard,
} from "lucide-react";
import { FaViruses } from "react-icons/fa";
import { TbVaccine } from "react-icons/tb";

const NewsCarousel = () => {
  // State for news carousel
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Medical icons to randomly assign to news items
  const medicalIcons = [
    <Stethoscope size={24} />,
    <Pill size={24} />,
    <Thermometer size={24} />,
    <FaViruses size={24} />,
    <TbVaccine size={24} />,
    <Clipboard size={24} />,
    <Heart size={24} />,
    <Activity size={24} />,
  ];

  // Get a random icon for each news item
  const getRandomIcon = () => {
    return medicalIcons[Math.floor(Math.random() * medicalIcons.length)];
  };

  // Calculate date for one week ago
  const getOneWeekAgoDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 17);
    return date.toISOString().split("T")[0];
  };

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Set date range for past week
        const fromDate = getOneWeekAgoDate();
        const toDate = new Date().toISOString().split("T")[0];

        // Using NewsAPI with medical news query
        // You'll need to replace with your actual API key
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=medical+healthcare+doctor+India&language=en&from=${fromDate}&to=${toDate}&sortBy=publishedAt&apiKey=e64a30cc69d544ddb007e9a0438a9de0`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();

        // Process news items with icons and categories
        if (data.articles && data.articles.length > 0) {
          const processedNews = data.articles
            .filter((article) => article.title && article.description)
            .map((article) => ({
              ...article,
              icon: getRandomIcon(),
              category: getCategoryFromArticle(article),
            }))
            .slice(0, 10); // Limit to 10 news items

          setNewsItems(processedNews);
        } else {
          throw new Error("No news found");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Determine category based on article content
  const getCategoryFromArticle = (article) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();
    const content = title + " " + description;

    if (
      content.includes("covid") ||
      content.includes("virus") ||
      content.includes("pandemic")
    ) {
      return { name: "Infectious Disease", color: "bg-red-100 text-red-600" };
    } else if (
      content.includes("research") ||
      content.includes("study") ||
      content.includes("discovery")
    ) {
      return {
        name: "Medical Research",
        color: "bg-purple-100 text-purple-600",
      };
    } else if (
      content.includes("hospital") ||
      content.includes("clinic") ||
      content.includes("healthcare facility")
    ) {
      return {
        name: "Healthcare Facility",
        color: "bg-blue-100 text-blue-600",
      };
    } else if (
      content.includes("vaccine") ||
      content.includes("immunization") ||
      content.includes("vaccination")
    ) {
      return { name: "Vaccination", color: "bg-green-100 text-green-600" };
    } else if (
      content.includes("policy") ||
      content.includes("regulation") ||
      content.includes("ministry")
    ) {
      return { name: "Health Policy", color: "bg-amber-100 text-amber-600" };
    } else if (
      content.includes("drug") ||
      content.includes("medicine") ||
      content.includes("pharmaceutical")
    ) {
      return {
        name: "Pharmaceuticals",
        color: "bg-indigo-100 text-indigo-600",
      };
    } else {
      return { name: "Healthcare", color: "bg-teal-100 text-teal-600" };
    }
  };

  // Carousel navigation
  const goToNextNews = () => {
    setCurrentNewsIndex((prevIndex) =>
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevNews = () => {
    setCurrentNewsIndex((prevIndex) =>
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  // Auto-carousel
  useEffect(() => {
    let interval;
    if (isAutoPlay && newsItems.length > 0) {
      interval = setInterval(() => {
        goToNextNews();
      }, 5000); // Change news every 5 seconds
    }

    return () => clearInterval(interval);
  }, [isAutoPlay, newsItems.length, currentNewsIndex]);

  // Pause auto-play when hovering
  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="bg-blue-100 text-blue-600 p-3 rounded-lg"
          >
            <Newspaper size={20} />
          </motion.div>
          <h3 className="text-lg font-semibold ml-3">Medical News</h3>
          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
            Last 7 Days
          </span>
        </div>
        <button
          onClick={toggleAutoPlay}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={isAutoPlay ? "Pause auto-play" : "Resume auto-play"}
        >
          {isAutoPlay ? <Clock size={20} /> : <RefreshCcw size={20} />}
        </button>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-teal-500 mb-4"
          >
            <Activity size={48} />
          </motion.div>
          <p className="text-gray-500">Loading latest medical news...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-red-700 mb-2">
            Unable to fetch news
          </h4>
          <p className="text-red-600">{error}</p>
        </div>
      ) : newsItems.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <Newspaper size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent medical news found.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-lg overflow-hidden bg-white shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNewsIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* News header with category */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg ${
                        newsItems[currentNewsIndex]?.category?.color ||
                        "bg-teal-100 text-teal-600"
                      }`}
                    >
                      {newsItems[currentNewsIndex]?.icon || (
                        <Newspaper size={24} />
                      )}
                    </div>
                    <div className="ml-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          newsItems[currentNewsIndex]?.category?.color ||
                          "bg-teal-100 text-teal-600"
                        }`}
                      >
                        {newsItems[currentNewsIndex]?.category?.name ||
                          "Healthcare"}
                      </span>
                      <div className="flex items-center mt-1">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(newsItems[currentNewsIndex]?.publishedAt)}
                        </span>
                        <MapPin size={14} className="text-gray-400 ml-3 mr-1" />
                        <span className="text-xs text-gray-500">Source</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {currentNewsIndex + 1}/{newsItems.length}
                    </span>
                  </div>
                </div>

                {/* News content */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {newsItems[currentNewsIndex]?.urlToImage ? (
                    <>
                      <img
                        src={newsItems[currentNewsIndex].urlToImage}
                        alt={newsItems[currentNewsIndex].title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 transform hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/600/300";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Newspaper size={64} className="text-gray-400" />
                      </motion.div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-xl font-bold line-clamp-2 leading-tight">
                      {newsItems[currentNewsIndex]?.title}
                    </h4>
                    <p className="text-white/80 text-sm mt-1">
                      {formatDate(newsItems[currentNewsIndex]?.publishedAt)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-700 line-clamp-3"
                  >
                    {newsItems[currentNewsIndex]?.description}
                  </motion.p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center"
                      >
                        <Heart size={14} className="mr-1" />
                        <span>Save</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center"
                      >
                        <ThumbsUp size={14} className="mr-1" />
                        <span>Relevant</span>
                      </motion.button>
                    </div>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={newsItems[currentNewsIndex]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium flex items-center shadow-md hover:bg-teal-700 transition-colors"
                    >
                      <span>Read full article</span>
                      <ExternalLink size={14} className="ml-1" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation bduttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevNews}
              className="absolute top-1/3 left-2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors "
              aria-label="Previous news"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextNews}
              className="absolute top-1/3 right-2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors "
              aria-label="Next news"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 space-x-1">
            {newsItems.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setCurrentNewsIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentNewsIndex
                    ? "w-8 bg-teal-500"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NewsCarousel;
