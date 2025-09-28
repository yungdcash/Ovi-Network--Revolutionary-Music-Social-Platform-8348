import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiHeadphones, FiMic, FiDisc, FiSpeaker, FiRadio } = FiIcons;

const FloatingElements = ({ className = '' }) => {
  const elements = [
    { icon: FiMusic, delay: 0, x: '10%', y: '20%' },
    { icon: FiHeadphones, delay: 0.5, x: '80%', y: '15%' },
    { icon: FiMic, delay: 1, x: '15%', y: '70%' },
    { icon: FiDisc, delay: 1.5, x: '85%', y: '75%' },
    { icon: FiSpeaker, delay: 2, x: '50%', y: '10%' },
    { icon: FiRadio, delay: 2.5, x: '20%', y: '50%' },
  ];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: element.x,
            y: element.y
          }}
          animate={{ 
            opacity: [0, 0.3, 0.1, 0.2, 0.05],
            scale: [0, 1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
            x: [element.x, `calc(${element.x} + 50px)`, element.x],
            y: [element.y, `calc(${element.y} - 30px)`, element.y]
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
          className="absolute"
          style={{
            left: element.x,
            top: element.y
          }}
        >
          <div className="w-8 h-8 md:w-12 md:h-12 text-white/20">
            <SafeIcon icon={element.icon} className="w-full h-full" />
          </div>
        </motion.div>
      ))}
      
      {/* Gradient Orbs */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={`orb-${index}`}
          initial={{ 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.1, 0.05, 0.1, 0],
            scale: [0, 1, 1.5, 1, 0.5],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ]
          }}
          transition={{
            duration: 15 + index * 2,
            delay: index * 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
          className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl"
        />
      ))}
    </div>
  );
};

export default FloatingElements;