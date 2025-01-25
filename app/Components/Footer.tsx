import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-2xl font-bold mb-4">StudentNest</h5>
            <p>Your trusted partner in finding the perfect student housing.</p>
          </div>
          <div>
            <h6 className="font-bold mb-4">Quick Links</h6>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amber-200 transition">Search Properties</a></li>
              <li><a href="#" className="hover:text-amber-200 transition">About Us</a></li>
              <li><a href="#" className="hover:text-amber-200 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">Contact</h6>
            <p>Email: support@studentnest.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
    </footer>
  )
}

export default Footer
