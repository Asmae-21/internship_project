"use client";
import React from "react";
import { Star } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-[#4B3DFE] flex items-start justify-between px-10 pt-4 pb-12 relative overflow-hidden min-h-[140px] shadow-xl backdrop-blur-md border border-[#e0e7ff]">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0" />
      

      
      <div className="flex flex-col gap-2 z-10">
        <span className="text-sm font-extrabold tracking-wide text-white">
          WELCOME BACK, YASSINE!
        </span>
        <span className="text-lg md:text-xl font-semibold text-white/90 tracking-wide">
          THURSDAY, 20 MARCH 2025
        </span>
      </div>
      {/* Graduation cap image */}
      <div className="absolute right-2 -top-2 z-10">
        <img 
          src="/graduation-cap.png" 
          alt="Graduation Cap" 
          className="w-36 h-36 object-contain"
        />
      </div>
      {/* Multiple sparkles scattered across the banner */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top left corner */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-4 left-8 w-8 h-8 opacity-30 brightness-200 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        
        {/* Top right corner */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-6 right-8 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        
        {/* Left middle */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-1/3 left-12 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
        
        {/* Right middle */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-1/2 right-16 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        
        {/* Center top */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-12 left-1/2 transform -translate-x-1/2 w-5 h-5 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
        
        {/* Center bottom */}
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 opacity-30 brightness-200 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        
        {/* Bottom left */}
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-4 left-20 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_14px_rgba(255,255,255,0.2)]" />
        
        {/* Bottom right */}
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-6 right-24 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_11px_rgba(255,255,255,0.3)] drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
        
        {/* Far left */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-1/4 left-4 w-5 h-5 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
        
        {/* Far right */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-1/4 right-4 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
        
        {/* Additional sparkles - well separated */}
        <img src="/spark.png" alt="Sparkle" className="absolute top-20 left-1/4 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute top-16 right-1/3 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_11px_rgba(255,255,255,0.3)] drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute top-2/3 left-1/6 w-5 h-5 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute top-3/4 right-1/6 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-16 left-1/3 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_11px_rgba(255,255,255,0.3)] drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-12 right-1/4 w-5 h-5 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute top-8 left-1/3 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute top-24 right-1/5 w-7 h-7 opacity-30 brightness-200 invert drop-shadow-[0_0_11px_rgba(255,255,255,0.3)] drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-20 left-1/5 w-5 h-5 opacity-30 brightness-200 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
        
        <img src="/spark.png" alt="Sparkle" className="absolute bottom-24 right-1/3 w-6 h-6 opacity-30 brightness-200 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] drop-shadow-[0_0_16px_rgba(255,255,255,0.2)]" />
      </div>
    </div>
  );
}; 