import React, { useState, useEffect } from 'react';
import { Droplet, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const waterQuotes = [
  {
    quote: "Thousands have lived without love, not one without water.",
    author: "W. H. Auden",
    context: "Poet"
  },
  {
    quote: "Water is the driving force of all nature.",
    author: "Leonardo da Vinci",
    context: "Polymath & Engineer"
  },
  {
    quote: "If there is magic on this planet, it is contained in water.",
    author: "Loren Eiseley",
    context: "Anthropologist & Naturalist"
  },
  {
    quote: "We forget that the water cycle and the life cycle are one.",
    author: "Jacques Yves Cousteau",
    context: "Ocean Explorer & Conservationist"
  },
  {
    quote: "When the well's dry, we know the worth of water.",
    author: "Benjamin Franklin",
    context: "Founding Father & Scientist"
  },
  {
    quote: "Pure water is the world's first and foremost medicine.",
    author: "Slovakian Proverb",
    context: "Traditional Wisdom"
  }
];

export const WaterQuotes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance quote every 3 seconds as requested
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % waterQuotes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + waterQuotes.length) % waterQuotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % waterQuotes.length);
  };

  const current = waterQuotes[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-2 text-center">
      {/* Seamlessly merged with page (NO heavy card block, NO thick borders) */}
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-xs mb-3">
          <Droplet className="w-3.5 h-3.5 text-brand-500" />
          <span>Water Wisdom &bull; Purity & Conservation</span>
        </div>

        {/* Big Subtle Quote Symbol */}
        <div className="flex justify-center mb-1">
          <Quote className="w-7 h-7 text-brand-400/50 rotate-180" />
        </div>

        {/* Centered Quote Text */}
        <div className="min-h-[70px] flex items-center justify-center max-w-2xl px-4">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-slate-800 dark:text-slate-100 leading-snug tracking-normal animate-fade-in text-center">
            "{current.quote}"
          </blockquote>
        </div>

        {/* Centered Author Name Below the Quote */}
        <div className="mt-3 flex flex-col items-center justify-center text-center">
          <cite className="not-italic text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400">
            &mdash; {current.author}
          </cite>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            ({current.context})
          </span>
        </div>

        {/* Subtle Pagination & Manual Chevrons */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Previous Quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {waterQuotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-5 h-1.5 bg-brand-500'
                    : 'w-1.5 h-1.5 bg-slate-300 dark:bg-navy-700 hover:bg-slate-400'
                }`}
                title={`Quote ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Next Quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
