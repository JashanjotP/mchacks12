import React, { useState } from 'react'
import { Search } from 'lucide-react'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="relative mt-4 mx-5 pt-36 pb-36 px-8 z-10 bg-amber-100/90 backdrop-blur-sm shadow-md"
      style={{
        borderBottomRightRadius: '5rem',
        borderBottomLeftRadius: '5rem'}}>
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold text-amber-900 leading-tight">
              A Housing Community for students, empowered by verified students!
            </h2>
            <ul className="list-disc pl-5 text-xl text-amber-800 opacity-80">
              <li>✔️ Trusted by over 50 verified students.</li>
              <li>✔️ Analyze leases for hidden fees and risks.</li>
              <li>✔️ Compare the cheapest rents near you.</li>
              <li>✔️ Read honest reviews from fellow students.</li>
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
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition">
                Search
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden md:block">
            <img 
              src="/api/placeholder/600/400" 
              alt="Student Housing" 
              className="rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </header>
  )
}

export default Hero

