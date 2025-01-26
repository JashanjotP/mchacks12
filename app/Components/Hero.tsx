import React, { useState } from 'react'
import { Search } from 'lucide-react'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="relative mt-4 mx-5 pt-32 pb-36 px-8 z-10 bg-amber-100/90 backdrop-blur-sm shadow-md"
      style={{
        borderBottomRightRadius: '5rem',
        borderBottomLeftRadius: '5rem'}}>
        <div className="container mx-auto grid md:grid-cols-2 gap-5 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold text-amber-900 leading-tight">
              A Housing Community for students, empowered by verified students!
            </h2>
            <ul className="list-disc pl-5 text-xl text-amber-800 opacity-80">
              <li>✔️ Trusted by over 50 verified students.</li>
              <li>✔️ Analyze your lease for hidden fees and risks.</li>
              <li>✔️ Compare the cheapest rents near you.</li>
              <li>✔️ Read real reviews from real people!</li>
            </ul>

            
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search by university, city, or neighborhood"
                className="w-full p-4 pl-12 rounded-full border-2 border-amber-300 focus:border-amber-500 transition bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" size={24} />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
                onClick={() => {
                  if (searchQuery) {
                    window.location.href = '/ratingpage';
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden md:grid relative grid-cols-2 grid-rows-2 gap-4">
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
        </div>
      </header>
  )
}

export default Hero

