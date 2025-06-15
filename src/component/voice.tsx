"use client";
 
import React, { useState, useEffect, useMemo } from 'react';
import { PhoneOff } from 'lucide-react';
import ReactSiriwave, { type IReactSiriwaveProps } from 'react-siriwave';
import { motion, AnimatePresence } from 'framer-motion';
import useVapi from '../hook/voiceHook';
import { DotPulse } from 'ldrs/react';
import 'ldrs/react/DotPulse.css';

// Define CurveStyle type
type CurveStyle = "ios" | "ios9";
 
interface SiriProps {
  theme: CurveStyle;
  publicKey: string;
  assistantId: string;
}

const CallDuration = ({ duration }: { duration: number }) => {
  const minsString = Math.floor(duration / 60).toString();
  const secsString = (duration % 60).toString().padStart(2, '0');
  
  return (
    <div className="relative overflow-hidden whitespace-nowrap text-base font-medium text-white flex">
      {/* Minutes */}
      <AnimatePresence initial={false} mode="popLayout">
        {minsString.split('').map((n, i) => (
          <motion.div
            className="inline-block tabular-nums"
            key={`min-${i}-${n}`}
            initial={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
            animate={{ y: "0", filter: "blur(0px)", opacity: 1 }}
            exit={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
            transition={{ 
              type: "spring", 
              bounce: 0.35
            }}
          >
            {n}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Colon */}
      <span>:</span>
      
      {/* Seconds */}
      <AnimatePresence initial={false} mode="popLayout">
        {secsString.split('').map((digit, index) => (
          <motion.div
            className="inline-block tabular-nums"
            key={`sec-${index}-${digit}`}
            initial={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
            animate={{ y: "0", filter: "blur(0px)", opacity: 1 }}
            exit={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
            transition={{ 
              type: "spring", 
              bounce: 0.35
            }}
          >
            {digit}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Animation variants
const BOUNCE_VALUES = {
  idle: 0.5,
  'idle-connecting': 0.2,
  'connecting-active': 0.35,
  'active-idle': 0.4,
  'connecting-idle': 0.5,
  'idle-active': 0.2
};

const Siri: React.FC<SiriProps> = ({ theme, publicKey, assistantId }) => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi({ publicKey, assistantId });
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [view, setView] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [transitionKey, setTransitionKey] = useState<string>('idle');
  const [siriWaveConfig, setSiriWaveConfig] = useState<IReactSiriwaveProps>({
    theme: theme || "ios9",
    ratio: 1,
    speed: 0.2,
    amplitude: 1,
    frequency: 6,
    color: '#fff',
    cover: false,
    width: 100,
    height: 40,
    autostart: true,
    pixelDepth: 1,
    lerpSpeed: 0.1,
  });

  // Update view based on state changes
  useEffect(() => {
    const prevView = view;
    let newView: 'idle' | 'connecting' | 'active';
    
    if (isSessionActive) {
      newView = 'active';
    } else if (isConnecting) {
      newView = 'connecting';
    } else {
      newView = 'idle';
    }
    
    if (newView !== view) {
      setView(newView);
      setTransitionKey(`${prevView}-${newView}`);
    }
  }, [isSessionActive, isConnecting, view]);
 
  useEffect(() => {
    setSiriWaveConfig(prevConfig => ({
      ...prevConfig,
      amplitude: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 7.5 : 0.5) : 0,
      speed: isSessionActive ? (volumeLevel > 0.5 ? volumeLevel * 10 : 0.2) : 0,
      frequency: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 5 : 2) : (volumeLevel > 0.5 ? volumeLevel * 10 : 0),
    }));
  }, [volumeLevel, isSessionActive]);

  // Reset connecting state when session becomes active
  useEffect(() => {
    if (isSessionActive) {
      setIsConnecting(false);
    }
  }, [isSessionActive]);

  // Timer for call duration
  useEffect(() => {
    let timer: number;
    if (isSessionActive) {
      setCallDuration(0);
      timer = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSessionActive]);

  const handleStartCall = async () => {
    if (!isSessionActive && !isConnecting) {
      setIsConnecting(true);
      try {
        await toggleCall();
      } catch (error) {
        console.error('Failed to start call:', error);
        setIsConnecting(false);
      }
    }
  };

  const handleEndCall = () => {
    if (isSessionActive) {
      toggleCall();
    }
  };

  // Determine the bounce value for animations
  const bounceValue = BOUNCE_VALUES[transitionKey as keyof typeof BOUNCE_VALUES] || BOUNCE_VALUES.idle;

  // Content based on view
  const content = useMemo(() => {
    switch (view) {
      case 'active':
        return (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1 text-center">
              <CallDuration duration={callDuration} />
            </div>
            <div className="h-8">
              <ReactSiriwave width={100} {...siriWaveConfig} />
            </div>
          </div>
        );
      case 'connecting':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-white text-sm font-medium px-4">
            <DotPulse
              size={43}
              speed={1.3}
              color="white"
            />
          </div>
        );
      case 'idle':
      default:
        return <div className="h-7" />;
    }
  }, [view, callDuration, siriWaveConfig]);

  // Width based on view
  const width = useMemo(() => {
    switch (view) {
      case 'active':
      case 'connecting':
        return 230;
      case 'idle':
      default:
        return 120;
    }
  }, [view]);

  const targetHeight = useMemo(() => {
    switch (view) {
      case 'active':
      case 'connecting':
        return 56; // py-3 (12+12=24px) + h-8 siriwave wrapper (32px) = 56px
      case 'idle':
      default:
        return 28; // h-7 (28px)
    }
  }, [view]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="h-[160px] flex flex-col justify-center items-center">
        {/* Dynamic Island with Layout Animation */}
        <div className="mb-8 relative">
          <motion.div
            layout
            style={{ borderRadius: '40px' }}
            className="overflow-hidden bg-black"
            animate={{ width, height: targetHeight }}
            transition={{
              type: "spring",
              bounce: bounceValue,
            }}
          >
            <motion.div
              key={view}
              className="w-full h-full"
              initial={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  // delay: 0.075,
                }
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
              }}
              transition={{
                type: "spring",
                bounce: bounceValue,
              }}
            >
              {content}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Call Controls Outside the Dynamic Island */}
        <AnimatePresence mode="wait">
          {!isSessionActive && !isConnecting ? (
            <motion.button
              key="start-call"
              onClick={handleStartCall}
              className="rounded-full w-32 h-10 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:cursor-pointer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <span className="font-medium">Start Call</span>
            </motion.button>
          ) : (
            <motion.button
              key="end-call"
              onClick={handleEndCall}
              className="rounded-full w-32 h-10 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:cursor-pointer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-center gap-2">
                <PhoneOff size={18} />
                <span className="font-medium">End Call</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
 
export default Siri;
