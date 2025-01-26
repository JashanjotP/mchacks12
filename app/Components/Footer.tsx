import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white py-12 relative z-10">
        <div className="container grid md:grid-cols-3 gap-8 px-5">
          <div>
            <h5 className="text-2xl font-bold mb-4">Student Sphere</h5>
            <p> We're a community to help students find homes they love.</p>
          </div>
          <div>
            <h6 className="font-bold mb-4">Quick Links</h6>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-amber-200 transition">Home</a></li>
              <li><a href="/ratingpage" className="hover:text-amber-200 transition">House Ratings</a></li>
              <li><a href="/heatmap" className="hover:text-amber-200 transition">Heat Map</a></li>
              <li><a href="/lease" className="hover:text-amber-200 transition">Check my Lease</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">Contact</h6>
            <p>Email: pharpala@uoguelph.ca</p>
            <p>Phone: (226) 501-7697</p>
          </div>
        </div>
    </footer>
  )
}

export default Footer
