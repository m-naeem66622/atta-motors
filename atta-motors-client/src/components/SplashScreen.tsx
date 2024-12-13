import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";

interface SplashScreenProps {}

export const SplashScreen: FC<SplashScreenProps> = () => {
  return (
    <AnimatePresence>
      {
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 z-50"
        >
          <div className="text-center">
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 100 }}
              transition={{
                delay: 0.2,
                duration: 5,
                type: "spring",
                stiffness: 260,
                damping: 50,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mb-8 flex items-center justify-center"
            >
              <Car className="w-24 h-24 text-white" />
            </motion.div>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Atta Motors
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-white"
            >
              Your journey begins here
            </motion.p>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};
