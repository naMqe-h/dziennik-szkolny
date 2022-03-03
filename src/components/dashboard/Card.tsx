import { motion } from "framer-motion";

// animacje
const textMotion = {
  rest: {
    opacity: 1,
    y: -30,
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const iconMotion = {
  rest: {
    opacity: 0,
    ease: "easeOut",
    duration: 0.3,
    type: "tween",
    y: 20,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "tween",
      ease: "easeIn",
    },
  },
};

interface cardProps {
  text: string;
  background?: string;
}

export const Card: React.FC<cardProps> = ({ children, text, background }) => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`p-10 flex flex-col items-center content-center rounded-xl cursor-pointer min-h-100 
      ${background ? background : "bg-gradient-to-r from-indigo-500  to-pink-500"}`}
      
    >
      <motion.div variants={iconMotion} className="text-secondary-content">{children}</motion.div>
      <motion.div variants={textMotion}>
        <span className="text-lg font-bold tracking-wide text-secondary-content">
          {text.toUpperCase()}
        </span>
      </motion.div>
    </motion.div>
  );
};

// style={{
//   background: `${
//     background
//       ? background
//       : "radial-gradient(circle, rgba(221,157,6,1) 0%, rgba(163,123,0,1) 50%, rgba(152,102,0,1) 100%)"
//   }`,
// }}