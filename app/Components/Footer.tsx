import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white py-8 md:py-12 relative z-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-5">
          <div className="text-center md:text-left">
            <h5 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Student Sphere</h5>
            <p className="text-sm md:text-base opacity-90">We're a community to help students find homes they love.</p>
          </div>
          <div className="text-center md:text-left">
            <h6 className="font-bold mb-3 md:mb-4">Quick Links</h6>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="/" className="hover:text-amber-200 transition">Home</a></li>
              <li><a href="/ratingpage" className="hover:text-amber-200 transition">House Ratings</a></li>
              <li><a href="/heatmap" className="hover:text-amber-200 transition">Heat Map</a></li>
              <li><a href="/lease" className="hover:text-amber-200 transition">Check my Lease</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h6 className="font-bold mb-3 md:mb-4">Contact</h6>
            <p className="text-sm md:text-base">Email: pharpala@uoguelph.ca</p>
            <p className="text-sm md:text-base">Phone: (226) 501-7697</p>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-6 border-t border-amber-800 text-center text-sm opacity-70 px-4">
          © 2026 StudentSphere. All rights reserved.
        </div>
    </footer>
  )
}

export default Footer
