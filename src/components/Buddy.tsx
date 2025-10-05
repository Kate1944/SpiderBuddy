import { motion } from 'framer-motion';

export default function Avatar({ mood, onClick }) {
  return (
    <motion.div
      className="cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: mood === 'excited' ? [0, -10, 0] : [0, -5, 0],
      }}
      transition={{
        y: {
          duration: mood === 'excited' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <svg width="120" height="140" viewBox="0 0 120 140">
        {/* Shadow */}
        <ellipse cx="60" cy="130" rx="30" ry="8" fill="#000" opacity="0.2"/>
        
        {/* Body */}
        <motion.circle 
          cx="60" 
          cy="70" 
          r="35" 
          fill="#4F46E5"
          animate={{
            scale: mood === 'excited' ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Head */}
        <motion.circle 
          cx="60" 
          cy="35" 
          r="25" 
          fill="#6366F1"
          animate={{
            scale: mood === 'excited' ? [1, 1.08, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Eyes */}
        <circle cx="50" cy="32" r="3" fill="#1F2937"/>
        <circle cx="70" cy="32" r="3" fill="#1F2937"/>
        {mood === 'excited' && (
          <>
            <circle cx="50" cy="30" r="1.5" fill="#fff"/>
            <circle cx="70" cy="30" r="1.5" fill="#fff"/>
          </>
        )}
        
        {/* Mouth */}
        {mood === 'excited' ? (
          <path d="M 50 42 Q 60 48 70 42" stroke="#1F2937" strokeWidth="2" fill="none"/>
        ) : (
          <path d="M 50 42 Q 60 45 70 42" stroke="#1F2937" strokeWidth="2" fill="none"/>
        )}
        
        {/* Arms */}
        <motion.circle 
          cx="30" 
          cy="75" 
          r="12" 
          fill="#6366F1"
          animate={{
            rotate: mood === 'excited' ? [0, 20, 0] : 0
          }}
        />
        <motion.circle 
          cx="90" 
          cy="75" 
          r="12" 
          fill="#6366F1"
          animate={{
            rotate: mood === 'excited' ? [0, -20, 0] : 0
          }}
        />
        
        {/* Feet */}
        <ellipse cx="50" cy="105" rx="10" ry="6" fill="#4338CA"/>
        <ellipse cx="70" cy="105" rx="10" ry="6" fill="#4338CA"/>
      </svg>
      
      {/* Task count badge */}
      {/* {taskCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg"
        >
          {taskCount}
        </motion.div>
      )} */}
    </motion.div>
  );
}