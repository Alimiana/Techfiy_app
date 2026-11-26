import { useEffect } from 'react';
import { motion } from 'motion/react';
import { TechifyMark } from './BrandLogo';
import { Language } from '../types/lms';

interface SplashScreenProps {
  language: Language;
  onFinish: () => void;
}

export function SplashScreen({ language, onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1250);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#0F766E] to-[#147D73] text-white flex flex-col items-center justify-center p-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Subtle ambient geometric rings */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-white text-[#0F766E] dark:text-[#0F766E] flex items-center justify-center shadow-xl shadow-teal-950/20">
          <TechifyMark className="w-11 h-11" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">
            Techify
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium">
            {language === 'id' ? 'Kuasai materi IT' : 'Master IT concepts'}
          </p>
        </div>

        <div className="w-28 h-1 rounded-full bg-white/20 overflow-hidden mt-3">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="h-full bg-white dark:bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
