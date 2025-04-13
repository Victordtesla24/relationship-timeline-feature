'use client';

import Link from 'next/link';
import { useState } from 'react';
import TimelineAnimation from '@/components/timeline/TimelineAnimation';

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section with Split Design */}
      <section className="min-h-[80vh] relative flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center py-16 md:py-0 px-6 md:px-16 lg:px-24">
          <div className="max-w-lg mx-auto md:mx-0 md:ml-auto">
            <div className="mb-2 inline-block">
              <div className="flex items-center mb-4">
                <div className="h-px w-10 bg-primary-500 mr-4"></div>
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">RELATIONSHIP TIMELINE</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Preserve your relationship <span className="text-primary-600">journey</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Document important moments, gather memories, and create a beautiful timeline of your relationship story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/timeline"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300 shadow-sm"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/timeline"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium text-primary-600 bg-transparent border border-primary-600 hover:bg-primary-50 transition-colors duration-300"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 bg-primary-50 flex items-center justify-center py-16 md:py-0 px-6 md:px-16 lg:px-24 order-first md:order-last relative overflow-hidden">
          {/* Enhanced timeline visualization with more personal touch */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] w-full max-w-md mx-auto">
            {/* Decorative elements */}
            <div className="absolute w-36 h-36 bg-primary-100 rounded-full top-0 right-0 z-10 animate-pulse"></div>
            <div className="absolute w-24 h-24 bg-primary-200 rounded-full bottom-0 left-12 z-10 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute w-16 h-16 bg-primary-300/50 rounded-full top-1/3 left-0 z-10 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Timeline visualization with photos */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-20">
              <div className="h-1 w-full bg-primary-300"></div>
              
              <div className="absolute top-0 left-[15%] transform -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full border-4 border-white shadow-lg bg-cover bg-center mb-3 transform transition-all duration-500 hover:scale-110" 
                       style={{backgroundImage: "url('https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')"}}></div>
                  <div className="bg-white p-4 rounded-lg shadow-md max-w-[150px]">
                    <p className="text-xs text-gray-500">First date</p>
                    <p className="text-sm font-medium">Feb 2023</p>
                    <p className="text-xs text-gray-600 mt-1">Coffee shop downtown</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 left-[50%] transform -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full border-4 border-white shadow-lg bg-cover bg-center mb-3 transform transition-all duration-500 hover:scale-110" 
                       style={{backgroundImage: "url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')"}}></div>
                  <div className="bg-white p-4 rounded-lg shadow-md max-w-[150px]">
                    <p className="text-xs text-gray-500">Vacation</p>
                    <p className="text-sm font-medium">Jul 2023</p>
                    <p className="text-xs text-gray-600 mt-1">Beach trip to Malibu</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 left-[85%] transform -translate-y-1/2">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full border-4 border-white shadow-lg bg-cover bg-center mb-3 transform transition-all duration-500 hover:scale-110" 
                       style={{backgroundImage: "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')"}}></div>
                  <div className="bg-white p-4 rounded-lg shadow-md max-w-[150px]">
                    <p className="text-xs text-gray-500">Anniversary</p>
                    <p className="text-sm font-medium">Feb 2024</p>
                    <p className="text-xs text-gray-600 mt-1">Dinner at The Rooftop</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional relationship elements */}
            <div className="absolute bottom-6 right-10 z-20">
              <div className="bg-white p-3 rounded-lg shadow-md flex items-center max-w-[180px] transform rotate-6">
                <div className="h-10 w-10 rounded-full bg-cover bg-center mr-3" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')"}}></div>
                <div>
                  <p className="text-xs text-gray-500">Movie night</p>
                  <p className="text-sm font-medium">Apr 2023</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-10 left-10 z-20">
              <div className="bg-white p-3 rounded-lg shadow-md flex items-center max-w-[180px] transform -rotate-3">
                <div className="h-10 w-10 rounded-full bg-cover bg-center mr-3" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')"}}></div>
                <div>
                  <p className="text-xs text-gray-500">Weekend hike</p>
                  <p className="text-sm font-medium">May 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Demo Video Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-sm font-medium mb-4">
              INTERACTIVE DEMO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">See your relationship story come to life</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our beautiful visualizations help you document and celebrate every moment of your journey together.
            </p>
          </div>
          
          <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl">
            {isVideoPlaying ? (
              <div className="aspect-video bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center relative">
                <TimelineAnimation onClose={toggleVideo} />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                {/* Video placeholder with animated elements */}
                <div className="w-full h-full absolute">
                  {/* Timeline animation background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100"></div>
                  
                  {/* Animated dots moving along timeline */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300">
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-4 w-4 rounded-full bg-primary-500 animate-pulse"></div>
                    <div className="absolute top-1/2 left-[25%] transform -translate-y-1/2 h-4 w-4 rounded-full bg-primary-500" style={{animation: 'pulse 2s infinite', animationDelay: '0.5s'}}></div>
                    <div className="absolute top-1/2 left-[50%] transform -translate-y-1/2 h-4 w-4 rounded-full bg-primary-500" style={{animation: 'pulse 2s infinite', animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-[75%] transform -translate-y-1/2 h-4 w-4 rounded-full bg-primary-500" style={{animation: 'pulse 2s infinite', animationDelay: '1.5s'}}></div>
                  </div>
                  
                  {/* Animated cards that fade in */}
                  <div className="absolute top-1/4 left-[25%] transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-48 animate-fade-in">
                    <p className="font-medium text-primary-600">First Date</p>
                    <p className="text-sm text-gray-600">The beginning of our journey</p>
                    <div className="h-20 mt-2 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                  
                  <div className="absolute bottom-1/4 left-[50%] transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-48" style={{animation: 'fadeIn 1s ease-in-out', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards'}}>
                    <p className="font-medium text-primary-600">Beach Vacation</p>
                    <p className="text-sm text-gray-600">Our favorite memory</p>
                    <div className="h-20 mt-2 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                  
                  <div className="absolute top-1/4 left-[75%] transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-48" style={{animation: 'fadeIn 1s ease-in-out', animationDelay: '1s', opacity: 0, animationFillMode: 'forwards'}}>
                    <p className="font-medium text-primary-600">Anniversary</p>
                    <p className="text-sm text-gray-600">Celebrating our love</p>
                    <div className="h-20 mt-2 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
                
                {/* Play button overlay */}
                <div className="relative z-10 flex flex-col items-center">
                  <button 
                    onClick={toggleVideo}
                    className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg transition-all duration-300 mb-4 transform hover:scale-110 cursor-pointer"
                    aria-label="Play demo animation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <p className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">Watch Demo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to document your relationship</h2>
            <p className="text-lg text-gray-600">
              Our thoughtfully designed tools make it easy to create a beautiful timeline of your relationship journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Chronological Timeline</h3>
              <p className="text-gray-600">
                Create a precise timeline of your relationship with important dates and milestones.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Media Gallery</h3>
              <p className="text-gray-600">
                Attach photos and documents to each event, creating a rich visual history.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Event Notes</h3>
              <p className="text-gray-600">
                Add detailed notes to capture the emotions and context of each moment.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Multiple Timelines</h3>
              <p className="text-gray-600">
                Create separate timelines for different relationships or phases of your journey.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Interactive View</h3>
              <p className="text-gray-600">
                Navigate through your timeline with smooth, intuitive interactions.
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary-300 group">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-all duration-300">Professional Export</h3>
              <p className="text-gray-600">
                Export your timeline as a beautifully formatted PDF or Word document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-600 text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple steps to document your relationship</h2>
            <p className="text-lg text-gray-600">
              Creating your relationship timeline is easy and intuitive.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-primary-100 shadow-md">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Timeline</h3>
              <p className="text-gray-600">
                Start by creating a new timeline and giving it a meaningful name.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-primary-100 shadow-md">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Key Events</h3>
              <p className="text-gray-600">
                Document important moments with dates, descriptions, and media.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-primary-100 shadow-md">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize & Enhance</h3>
              <p className="text-gray-600">
                Add photos, notes, and details to make your timeline personal and unique.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-primary-100 shadow-md">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share or Export</h3>
              <p className="text-gray-600">
                View your beautiful timeline, share it, or export it as a document.
              </p>
            </div>
          </div>
          
          {/* Process arrows for desktop */}
          <div className="hidden md:block relative max-w-5xl mx-auto mt-8">
            <div className="absolute top-0 left-[23%] w-[54%] h-0.5 bg-primary-200">
              <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-primary-300 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-primary-50 rounded-3xl overflow-hidden">
            <div className="px-8 py-16 md:p-16 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Ready to start your relationship timeline?
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl">
                Begin documenting your journey today. It takes just a minute to get started.
              </p>
              <Link
                href="/timeline"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300 shadow-md"
              >
                Create Your Timeline
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
} 