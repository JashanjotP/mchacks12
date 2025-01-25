import React from 'react'
import { Home } from 'lucide-react' 

const Navbar = () => {
  return (
    <nav className="fixed mx-5 mt-2 rounded-3xl top-0 left-0 right-0 bg-amber-100/90 backdrop-blur-sm shadow-md z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="text-amber-600 mr-4" size={30} />
            <h1 className="text-2xl font-bold text-amber-900">Student Sphere</h1>
          </div>
          <div className="space-x-6">
            <a href="#" className="text-amber-800 hover:text-amber-600 transition">Home</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition">Properties</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition">About</a>
            <a href="#" className="text-amber-800 hover:text-amber-600 transition">Contact</a>
          </div>
        </div>
    </nav>
  )
}

export default Navbar
