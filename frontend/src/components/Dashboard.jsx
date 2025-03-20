import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Calendar,
  ClipboardList,
  Activity,
  ThumbsUp,
  Heart,
  AlertTriangle,
  ArrowRight,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Stethoscope,
  Pill,
  Thermometer,
  Clipboard,
  Award,
  RefreshCcw,
  Plus,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { TbVaccine } from "react-icons/tb";
import { FaViruses } from "react-icons/fa";
const Dashboard = () => {
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
    date.setDate(date.getDate() - 7);
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

        // Using NewsAPI with India medical news query
        // You'll need to replace with your actual API key
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=medical+healthcare+hospital+doctor+India&language=en&from=${fromDate}&to=${toDate}&sortBy=publishedAt&apiKey=e64a30cc69d544ddb007e9a0438a9de0`
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

  const recentActivities = [
    {
      id: 1,
      title: "Appointment with Dr. Sarah",
      type: "appointment",
      date: "15 Mar",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Lab Test Results",
      type: "test",
      date: "12 Mar",
      status: "completed",
    },
    {
      id: 3,
      title: "Medication Refill",
      type: "medication",
      date: "10 Mar",
      status: "processed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
            <p className="opacity-90">Here's your health overview for today.</p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            className="bg-white/20 p-4 rounded-full"
          >
            <Stethoscope size={32} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* News Carousel - Enhanced version */}
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
            <h3 className="text-lg font-semibold ml-3">India Medical News</h3>
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
                            {getTimeAgo(
                              newsItems[currentNewsIndex]?.publishedAt
                            )}
                          </span>
                          <MapPin
                            size={14}
                            className="text-gray-400 ml-3 mr-1"
                          />
                          <span className="text-xs text-gray-500">India</span>
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
                  <div className="relative h-64 bg-gray-100">
                    {newsItems[currentNewsIndex]?.urlToImage ? (
                      <>
                        <img
                          src={newsItems[currentNewsIndex].urlToImage}
                          alt={newsItems[currentNewsIndex].title}
                          className="w-full h-full object-cover"
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

              {/* Navigation buttons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToPrevNews}
                className="absolute top-1/3 left-2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                aria-label="Previous news"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToNextNews}
                className="absolute top-1/3 right-2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
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

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Analyzer Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-teal-50 -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="bg-teal-100 text-teal-600 p-3 rounded-lg"
              >
                <Utensils size={20} />
              </motion.div>
              <h3 className="text-lg font-semibold ml-3">
                Know About Your Food
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              Analyze if a food is suitable for your health conditions. Upload
              an image of ingredients and get personalized recommendations.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/food-analyzer"
                className="flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                <span>Analyze Food Now</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-50 -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="bg-blue-100 text-blue-600 p-3 rounded-lg"
              >
                <TrendingUp size={20} />
              </motion.div>
              <h3 className="text-lg font-semibold ml-3">Health Insights</h3>
            </div>

            <p className="text-gray-600 mb-4">
              View your personalized health trends and insights based on your
              medical history and vital signs.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/insights"
                className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <span>View Insights</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="card p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-purple-100 text-purple-600 p-2 rounded-lg"
            >
              <Clipboard size={18} />
            </motion.div>
            <h3 className="text-lg font-semibold ml-3">Recent Activities</h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            Last 7 days
          </span>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              key={activity.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center
                ${
                  activity.type === "appointment"
                    ? "bg-blue-100 text-blue-600"
                    : activity.type === "test"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {activity.type === "appointment" ? (
                  <Calendar size={16} />
                ) : activity.type === "test" ? (
                  <ClipboardList size={16} />
                ) : (
                  <Heart size={16} />
                )}
              </motion.div>
              <div className="ml-3 flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full
                ${
                  activity.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : activity.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/activities"
              className="inline-flex items-center text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors bg-teal-50 px-3 py-2 rounded-lg"
            >
              <span>View All Activities</span>
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Health Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="card p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-amber-100 text-amber-600 p-2 rounded-lg"
            >
              <Award size={18} />
            </motion.div>
            <h3 className="text-lg font-semibold ml-3">Health Tips For You</h3>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/tips"
              className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
            >
              View All
            </Link>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-blue-200/40 -mr-6 -mt-6 z-0"></div>
          <div className="relative z-10 flex items-start">
            <motion.div
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-blue-600 mr-3 mt-1"
            >
              <ThumbsUp size={18} />
            </motion.div>
            <div>
              <h4 className="font-medium text-blue-800">Stay Hydrated</h4>
              <p className="text-sm text-blue-700 mt-1">
                Aim to drink at least 8 glasses of water daily to maintain
                optimal hydration and support your overall health.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 text-xs bg-blue-200 text-blue-700 px-3 py-1 rounded-full flex items-center w-max"
              >
                <Plus size={12} className="mr-1" /> Add to daily goals
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
