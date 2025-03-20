import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

const WelcomeBanner = ({ username }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, {username}!</h2>
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
  );
};

export default WelcomeBanner;
