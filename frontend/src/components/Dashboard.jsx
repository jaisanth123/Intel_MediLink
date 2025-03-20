import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

// Import components
import WelcomeBanner from "./dashboard/WelcomeBanner";
import NewsCarousel from "./dashboard/NewsCarousel";
import FeatureCard from "./dashboard/FeatureCard";
import HealthTips from "./dashboard/HealthTips";

const Dashboard = () => {
  // Features data
  const features = [
    {
      id: 1,
      title: "Know About Your Food",
      description:
        "Analyze if a food is suitable for your health conditions. Upload an image of ingredients and get personalized recommendations.",
      icon: "Utensils",
      color: "teal",
      link: "/food-analyzer",
      linkText: "Analyze Food Now",
    },
    {
      id: 2,
      title: "Health Insights",
      description:
        "View your personalized health trends and insights based on your medical history and vital signs.",
      icon: "TrendingUp",
      color: "blue",
      link: "/insights",
      linkText: "View Insights",
    },
    {
      id: 3,
      title: "Virtual Consultation",
      description:
        "Connect with medical professionals for virtual consultations and get expert advice from the comfort of your home.",
      icon: "Video",
      color: "purple",
      link: "/consultation",
      linkText: "Book Consultation",
    },
    {
      id: 4,
      title: "Medication Tracker",
      description:
        "Never miss a dose with reminders and track your medication history for better health management.",
      icon: "Pill",
      color: "green",
      link: "/medications",
      linkText: "Track Medications",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner username="John" />

      {/* News Carousel */}
      <NewsCarousel />

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            color={feature.color}
            link={feature.link}
            linkText={feature.linkText}
          />
        ))}
      </div>

      {/* Health Tips */}
      <HealthTips />
    </div>
  );
};

export default Dashboard;
