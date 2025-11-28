// src/components/menu/DishCard.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DishData } from '@/lib/uploadUtils';

interface DishCardProps {
  dish: DishData & { id: string };
  index: number;
}

export default function DishCard({ dish, index }: DishCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Use base64 image directly
  const imageUrl = dish.imageBase64;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="group relative"
    >
      {/* Anti-gravity floating animation */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: index * 0.2
        }}
        className="h-full"
      >
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-500 h-full flex flex-col shadow-lg hover:shadow-2xl hover:shadow-purple-500/20">
          
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
            {/* Skeleton Loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
            )}
            
            {/* Hover scale effect */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={dish.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
            
            {/* Floating badge with glassmorphism */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/20">
              <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">${dish.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 line-clamp-2">
              {dish.name}
            </h3>
            
            {dish.description && (
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-3">
                {dish.description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-700/50 gap-2">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider truncate flex-1">
                {dish.category}
              </span>
              
              {/* Animated order button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 whitespace-nowrap"
              >
                Order Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

