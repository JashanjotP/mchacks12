'use client'

import React, { useState } from 'react'
import { Home, Menu, X } from 'lucide-react' 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-3 left-3 right-3 md:top-5 md:left-0 md:right-0 z-50 px-4 md:px-6 py-3 md:py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
            <Home className="text-white" size={18} />
          </div>
          <span className="text-lg md:text-xl font-bold text-amber-900 tracking-tight">
            StudentSphere
          </span>
        </a>

        {/* Center Navigation - Desktop */}
        <div className="hidden lg:flex items-center bg-white/80 backdrop-blur-md rounded-full px-2 py-2 shadow-lg border border-gray-100">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/ratingpage">Ratings</NavLink>
          <NavLink href="/heatmap">Heat Map</NavLink>
          <NavLink href="/lease">Lease Check</NavLink>
        </div>

        {/* CTA Button - Desktop */}
        <a 
          href="/ratingpage" 
          className="hidden lg:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          Get Started
        </a>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-md"
        >
          {isMenuOpen ? <X size={24} className="text-amber-900" /> : <Menu size={24} className="text-amber-900" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/ratingpage" onClick={() => setIsMenuOpen(false)}>Ratings</MobileNavLink>
            <MobileNavLink href="/heatmap" onClick={() => setIsMenuOpen(false)}>Heat Map</MobileNavLink>
            <MobileNavLink href="/lease" onClick={() => setIsMenuOpen(false)}>Lease Check</MobileNavLink>
            <a 
              href="/ratingpage" 
              className="mt-2 text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-full shadow-md transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium"
  >
    {children}
  </a>
)

const MobileNavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium"
  >
    {children}
  </a>
)

export default Navbar
