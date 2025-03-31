import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Utensils, TrendingUp, Video, Pill } from "lucide-react";

const FeatureCard = ({ title, description, icon, color, link, linkText }) => {
  // Map icon string tosadf component
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Utensils":
        return <Utensils size={20} />;
      case "TrendingUp":
        return <TrendingUp size={20} />;
      case "Video":
        return <Video size={20} />;
      case "Pill":
        return <Pill size={20} />;
      default:
        return <TrendingUp size={20} />;
    }
  };

  // Map color string to tailwifdnd classes
  const getColorClasses = (colorName) => {
    switch (colorName) {
      case "teal":
        return {
          bg: "bg-teal-100",
          text: "text-teal-600",
          hover: "hover:text-teal-700",
          circle: "bg-teal-50",
        };
      case "blue":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          hover: "hover:text-blue-700",
          circle: "bg-blue-50",
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          hover: "hover:text-purple-700",
          circle: "bg-purple-50",
        };
      case "green":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          hover: "hover:text-green-700",
          circle: "bg-green-50",
        };
      default:
        return {
          bg: "bg-teal-100",
          text: "text-teal-600",
          hover: "hover:text-teal-700",
          circle: "bg-teal-50",
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full ${colorClasses.circle} -mr-16 -mt-16 `}
      ></div>
      <div className="relative ">
        <div className="flex items-center mb-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className={`${colorClasses.bg} ${colorClasses.text} p-3 rounded-lg`}
          >
            {getIcon(icon)}
          </motion.div>
          <h3 className="text-lg font-semibold ml-3">{title}</h3>
        </div>

        <p className="text-gray-600 mb-4">{description}</p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={link}
            className={`flex items-center ${colorClasses.text} font-medium ${colorClasses.hover} transition-colors`}
          >
            <span>{linkText}</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
