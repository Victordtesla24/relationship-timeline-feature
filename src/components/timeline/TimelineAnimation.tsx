'use client';

import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface TimelineAnimationProps {
  onClose?: () => void;
}

const ANIMATION_EVENTS = [
  {
    id: 1,
    title: 'First Meeting',
    description: 'The beginning of our journey',
    date: '2023-01-15',
    icon: '👋',
  },
  {
    id: 2,
    title: 'First Date',
    description: 'Coffee shop downtown',
    date: '2023-02-01',
    icon: '☕',
  },
  {
    id: 3,
    title: 'Weekend Trip',
    description: 'Exploring the coast together',
    date: '2023-04-15',
    icon: '🏖️',
  },
  {
    id: 4,
    title: 'Movie Night',
    description: 'Our favorite romantic comedy',
    date: '2023-05-20',
    icon: '🎬',
  },
  {
    id: 5,
    title: 'Beach Vacation',
    description: 'Our favorite memory',
    date: '2023-07-10',
    icon: '🏝️',
  },
  {
    id: 6,
    title: 'Anniversary',
    description: 'Celebrating our love',
    date: '2024-02-01',
    icon: '🎉',
  },
];

export default function TimelineAnimation({ onClose }: TimelineAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentEventIndexRef = useRef<number>(0);

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM yyyy');
  };

  const resetAnimation = () => {
    startTimeRef.current = null;
    currentEventIndexRef.current = 0;
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.timeline-event');
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.transform = 'translateY(20px)';
      });

      const line = containerRef.current.querySelector('.timeline-line-progress');
      if (line) {
        (line as HTMLElement).style.width = '0%';
      }
    }
  };

  const animateTimeline = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const duration = 10000; // 10 seconds for full animation
    const progress = Math.min(elapsed / duration, 1);
    
    // Animate the line
    if (containerRef.current) {
      const line = containerRef.current.querySelector('.timeline-line-progress');
      if (line) {
        (line as HTMLElement).style.width = `${progress * 100}%`;
      }
    }

    // Show events one by one
    const eventsToShow = Math.ceil(progress * ANIMATION_EVENTS.length);
    
    if (eventsToShow > currentEventIndexRef.current && currentEventIndexRef.current < ANIMATION_EVENTS.length) {
      const eventElement = containerRef.current?.querySelector(`.timeline-event-${currentEventIndexRef.current}`);
      if (eventElement) {
        (eventElement as HTMLElement).style.opacity = '1';
        (eventElement as HTMLElement).style.transform = 'translateY(0)';
      }
      currentEventIndexRef.current++;
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animateTimeline);
    }
  };

  useEffect(() => {
    resetAnimation();
    // Start the animation after a short delay
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animateTimeline);
    }, 500);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-white p-4 rounded-xl overflow-hidden">
      {/* Close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-800/50 text-white flex items-center justify-center hover:bg-gray-700/50 transition-all"
          aria-label="Close animation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-center mb-4 text-primary-600">Your Relationship Journey</h3>
      
      {/* Timeline container - Moved to the center */}
      <div ref={containerRef} className="relative mx-auto max-w-2xl px-8 py-6 mt-10 mb-10">
        {/* Timeline line - Positioned in the middle */}
        <div className="absolute left-0 right-0 top-[50%] h-1 bg-gray-200 rounded-full">
          <div className="timeline-line-progress absolute left-0 top-0 bottom-0 bg-primary-500 rounded-full transition-all duration-500 ease-out" style={{ width: '0%' }}></div>
        </div>
        
        {/* Timeline events */}
        <div className="relative" style={{ height: "240px" }}>
          {ANIMATION_EVENTS.map((event, index) => {
            const isTop = index % 2 === 0;
            
            return (
              <div 
                key={event.id}
                className={`timeline-event timeline-event-${index} absolute transition-all duration-700 ease-out opacity-0`}
                style={{
                  left: `${(index / (ANIMATION_EVENTS.length - 1)) * 100}%`,
                  top: '50%',
                  transform: 'translateY(20px)',
                }}
              >
                {/* Event marker */}
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500 border-4 border-white shadow-lg"></div>
                </div>
                
                {/* Event card - Positioned above or below the timeline */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-40 p-3 bg-white rounded-lg shadow-lg z-10 ${
                    isTop ? '-translate-y-[calc(100%+24px)]' : 'translate-y-[24px]'
                  }`}
                >
                  <div className="text-2xl mb-1">{event.icon}</div>
                  <h4 className="font-semibold text-primary-600 text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-500">{formatDisplayDate(event.date)}</p>
                  <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Replay button */}
      <div className="text-center">
        <button 
          onClick={() => {
            resetAnimation();
            animationRef.current = requestAnimationFrame(animateTimeline);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Replay Animation
        </button>
      </div>
    </div>
  );
} 