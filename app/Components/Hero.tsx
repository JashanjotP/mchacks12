import React, { useState } from 'react'
import { Search } from 'lucide-react'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="relative mx-4 md:mx-5 pt-24 md:pt-28 pb-8 md:pb-20 px-6 md:px-8 z-10 bg-amber-100/90 backdrop-blur-sm shadow-md"
      style={{
        borderBottomRightRadius: '2rem',
        borderBottomLeftRadius: '2rem'}}>
        <div className="mt-6 md:mt-8 md:container md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-5 md:space-y-8">
            {/* Title with student.com style */}
            <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl leading-tight text-amber-900">
              A Housing Community
              <br />
              for students, empowered
              <br />
              by {' '}
              <span className="relative inline-block">
                <span className="text-amber-500 italic font-semibold">verified students!</span>
                {/* Swoosh underline */}
                <svg 
                  className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4" 
                  viewBox="0 0 300 20" 
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M5 14C30 6 80 4 150 10C220 16 270 12 295 8" 
                    stroke="#f59e0b" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    className="animate-draw"
                  />
                </svg>
              </span>
            </h2>

            {/* Bullet points - Hidden on mobile */}
            <ul className="hidden md:block space-y-2 text-base md:text-xl text-amber-800 opacity-80">
              <li>✔️ Analyze your lease for hidden fees and risks.</li>
              <li>✔️ Compare the cheapest rents near you.</li>
              <li>✔️ Read real reviews from real people!</li>
            </ul>

            {/* Search Bar - Desktop only here */}
            <div className="hidden md:block relative">
              <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                <input 
                  type="text"
                  placeholder="Search an address in Guelph"
                  className="flex-1 px-6 py-4 text-lg text-gray-700 placeholder-gray-400 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = '/ratingpage';
                    }
                  }}
                />
                <button 
                  className="m-1.5 p-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all"
                  onClick={() => {
                    if (searchQuery) {
                      window.location.href = '/ratingpage';
                    }
                  }}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Hero Images - Show on tablet and up */}
          <div className="hidden md:grid relative grid-cols-2 grid-rows-2 gap-3 md:gap-4 h-[350px] lg:h-[450px]">
            {/* Photo 1 */}
            <img 
              src="/girls.jpeg" 
              alt="Student Housing 1" 
              className="rounded-2xl shadow-lg w-full h-full object-cover col-span-1 row-span-2 transform hover:rotate-[-5deg] transition-transform duration-300 ease-in-out z-30"
            />

            {/* Photo 2 */}
            <img 
              src="/us.jpeg" 
              alt="Student Housing 2" 
              className="rounded-2xl shadow-lg w-full h-full object-cover col-span-1 row-span-1 transform hover:rotate-[-5deg] transition-transform duration-300 ease-in-out z-20"
            />

            {/* Photo 3 */}
            <img 
              src="/2guys.jpeg" 
              alt="Student Housing 3" 
              className="rounded-2xl shadow-lg w-full h-full object-cover col-span-1 row-span-1 transform hover:rotate-[-5deg] transition-transform duration-300 ease-in-out z-10"
            />
          </div>

          {/* Mobile Images - Two small images */}
          <div className="md:hidden flex justify-start gap-3">
            <img 
              src="/girls.jpeg" 
              alt="Student Housing" 
              className="rounded-2xl shadow-lg w-36 h-36 object-cover"
            />
            <img 
              src="/us.jpeg" 
              alt="Student Housing" 
              className="rounded-2xl shadow-lg w-36 h-36 object-cover"
            />
          </div>

          {/* Mobile Search Bar - Comes after image */}
          <div className="md:hidden relative w-full">
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
              <input 
                type="text"
                placeholder="Search an address in Guelph"
                className="flex-1 px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = '/ratingpage';
                  }
                }}
              />
              <button 
                className="m-1 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all"
                onClick={() => {
                  if (searchQuery) {
                    window.location.href = '/ratingpage';
                  }
                }}
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Hero

