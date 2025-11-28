// src/app/menu/page.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import { getAllDishes } from '@/lib/uploadUtils';
import DishCard from '@/components/menu/DishCard';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export default function MenuPage() {
  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ['dishes'],
    queryFn: getAllDishes,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-white">Oops!</h2>
          <p className="text-slate-400">Failed to load menu. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Our Menu
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Discover our carefully curated collection of culinary masterpieces
            </p>
          </motion.div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 space-y-4">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 animate-spin" />
            <p className="text-slate-400 text-base sm:text-lg">Loading delicious dishes...</p>
          </div>
        ) : dishes && dishes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {dishes.map((dish, index) => (
              <DishCard key={dish.id} dish={dish} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 md:py-20 space-y-3 sm:space-y-4"
          >
            <div className="text-5xl sm:text-6xl">🍽️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">No dishes yet</h2>
            <p className="text-slate-400 text-sm sm:text-base">Check back soon for amazing dishes!</p>
          </motion.div>
        )}
      </div>

      {/* Floating Action Hint */}
      {dishes && dishes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl shadow-purple-500/50 hidden md:block max-w-xs"
        >
          <p className="text-xs sm:text-sm font-medium">Hover over dishes for the anti-gravity effect! ✨</p>
        </motion.div>
      )}
    </div>
  );
}
