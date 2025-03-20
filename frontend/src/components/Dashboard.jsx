// File: src/pages/Dashboard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const Dashboard = () => {
  // Mock data for demonstration
  const stats = [
    {
      label: "Health Score",
      value: "85%",
      icon: <Activity size={20} />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Appointments",
      value: "3",
      icon: <Calendar size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Prescriptions",
      value: "2",
      icon: <ClipboardList size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Upcoming Tests",
      value: "1",
      icon: <AlertTriangle size={20} />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

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
        <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
        <p className="opacity-90">Here's your health overview for today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Analyzer Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center mb-4">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
              <Utensils size={20} />
            </div>
            <h3 className="text-lg font-semibold ml-3">Know About Your Food</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Analyze if a food is suitable for your health conditions. Upload an
            image of ingredients and get personalized recommendations.
          </p>

          <Link
            to="/food-analyzer"
            className="flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            <span>Analyze Food Now</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-semibold ml-3">Health Insights</h3>
          </div>

          <p className="text-gray-600 mb-4">
            View your personalized health trends and insights based on your
            medical history and vital signs.
          </p>

          <Link
            to="/insights"
            className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            <span>View Insights</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>

        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div
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
              </div>
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
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <Link
            to="/activities"
            className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
          >
            View All Activities
          </Link>
        </div>
      </motion.div>

      {/* Health Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Health Tips For You</h3>
          <Link
            to="/tips"
            className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <ThumbsUp className="text-blue-600 mr-3 mt-1" size={18} />
            <div>
              <h4 className="font-medium text-blue-800">Stay Hydrated</h4>
              <p className="text-sm text-blue-700 mt-1">
                Aim to drink at least 8 glasses of water daily to maintain
                optimal hydration and support your overall health.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
