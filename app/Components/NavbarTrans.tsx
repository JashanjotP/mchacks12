import React from 'react'
import { Home } from 'lucide-react' 

const NavbarTrans = () => {
  return (
    <nav className="fixed mx-5 mt-2 rounded-3xl top-0 left-0 right-0 bg-[#f1f0e840] backdrop-blur-sm shadow-md z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="text-amber-600 mr-4" size={30} />
            <h1 className="text-2xl font-bold text-amber-900">Student Sphere</h1>
          </div>
          <div className="space-x-12">
            <a href="/" className="text-amber-800 hover:text-amber-600 transition">Home</a>
            <a href="/ratingpage" className="text-amber-800 hover:text-amber-600 transition">House Ratings</a>
            <a href="/heatmap" className="text-amber-800 hover:text-amber-600 transition">Heat Map</a>
            <a href="/lease" className="text-amber-800 hover:text-amber-600 transition">Check my Lease</a>
          </div>
        </div>
    </nav>
  )
}

export default NavbarTrans
