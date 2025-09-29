import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const FloatingShape = ({
  children,
  className = "",
  delay = 0,
  duration = 4,
  initialX = 0,
  initialY = 0,
  floatRange = 20
}) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{
        x: initialX,
        y: initialY,
        opacity: 0,
        scale: 0.5,
        rotate: 0
      }}
      animate={{
        x: [initialX, initialX + floatRange, initialX - floatRange, initialX],
        y: [initialY, initialY - floatRange, initialY + floatRange, initialY],
        opacity: [0, 0.6, 0.4, 0.6],
        scale: [0.5, 1, 0.8, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }}>

      {children}
    </motion.div>);

};

const FloatingElements = ({ className = "" }) => {
  const { theme } = useTheme();

  const getGlowStyle = (size = 'md') => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };

    return {
      background: `linear-gradient(135deg, ${theme.glowColor}40, ${theme.glowColor}20)`,
      boxShadow: `0 0 20px ${theme.glowColor}30, inset 0 0 20px ${theme.glowColor}20`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${theme.glowColor}30`
    };
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Musical Note Shapes */}
      <FloatingShape
        className="top-1/4 left-1/4"
        delay={0}
        duration={6}
        floatRange={30}>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={getGlowStyle('md')}>

          🎵
        </div>
      </FloatingShape>

      <FloatingShape
        className="top-1/3 right-1/4"
        delay={1}
        duration={8}
        floatRange={25}>

        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
          style={getGlowStyle('lg')}>

          🎶
        </div>
      </FloatingShape>

      <FloatingShape
        className="bottom-1/4 left-1/3"
        delay={2}
        duration={7}
        floatRange={35}>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={getGlowStyle('sm')}>

          🎤
        </div>
      </FloatingShape>

      {/* Geometric Shapes */}
      <FloatingShape
        className="top-1/2 left-1/6"
        delay={0.5}
        duration={5}
        floatRange={20}>

        <div
          className="w-14 h-14 rounded-full"
          style={getGlowStyle('md')} />

      </FloatingShape>

      <FloatingShape
        className="bottom-1/3 right-1/6"
        delay={1.5}
        duration={6}
        floatRange={28}>

        <div
          className="w-12 h-12"
          style={{
            ...getGlowStyle('md'),
            borderRadius: '20%',
            transform: 'rotate(45deg)'
          }} />

      </FloatingShape>

      <FloatingShape
        className="top-1/6 right-1/3"
        delay={2.5}
        duration={9}
        floatRange={22}>

        <div
          className="w-8 h-8 rounded-full"
          style={getGlowStyle('sm')} />

      </FloatingShape>

      {/* Music Equipment Icons */}
      <FloatingShape
        className="bottom-1/6 left-1/2"
        delay={3}
        duration={7}
        floatRange={18}>

        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
          style={getGlowStyle('lg')}>

          🎧
        </div>
      </FloatingShape>

      <FloatingShape
        className="top-2/3 right-1/2"
        delay={1.8}
        duration={5.5}
        floatRange={25}>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={getGlowStyle('md')}>

          🎹
        </div>
      </FloatingShape>

      {/* Additional Geometric Elements */}
      <FloatingShape
        className="top-1/5 left-2/3"
        delay={4}
        duration={8}
        floatRange={15}>

        <div
          className="w-6 h-6 rounded-full"
          style={getGlowStyle('sm')} />

      </FloatingShape>

      <FloatingShape
        className="bottom-1/2 right-1/5"
        delay={2.2}
        duration={6.5}
        floatRange={32}>

        <div
          className="w-10 h-10"
          style={{
            ...getGlowStyle('sm'),
            borderRadius: '30%'
          }} />

      </FloatingShape>

      {/* Pulsing Dots */}
      <FloatingShape
        className="top-3/4 left-1/5"
        delay={3.5}
        duration={4}
        floatRange={12}>

        <motion.div
          className="w-4 h-4 rounded-full"
          style={getGlowStyle('sm')}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }} />

      </FloatingShape>

      <FloatingShape
        className="bottom-1/5 right-2/3"
        delay={4.2}
        duration={5.5}
        floatRange={18}>

        <motion.div
          className="w-6 h-6 rounded-full"
          style={getGlowStyle('sm')}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }} />

      </FloatingShape>

      {/* Waveform-like Elements */}
      <FloatingShape
        className="top-1/2 right-1/4"
        delay={1.2}
        duration={7}
        floatRange={20}>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) =>
          <motion.div
            key={i}
            className="w-1 bg-current rounded-full"
            style={{
              height: `${8 + i * 4}px`,
              color: theme.glowColor,
              boxShadow: `0 0 10px ${theme.glowColor}50`
            }}
            animate={{
              scaleY: [1, 1.5, 0.5, 1],
              opacity: [0.4, 0.8, 0.3, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }} />

          )}
        </div>
      </FloatingShape>

      {/* Orbit Ring */}
      <FloatingShape
        className="top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        delay={0}
        duration={12}
        floatRange={0}>

        <motion.div
          className="w-24 h-24 rounded-full border-2 border-opacity-30"
          style={{
            borderColor: theme.glowColor,
            boxShadow: `0 0 30px ${theme.glowColor}20`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}>

          <motion.div
            className="w-3 h-3 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: theme.glowColor,
              boxShadow: `0 0 10px ${theme.glowColor}`
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }} />

        </motion.div>
      </FloatingShape>
    </div>);

};

export default FloatingElements;