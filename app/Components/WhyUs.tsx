import React from 'react'
import { MapPin, Users, Check } from 'lucide-react'

const WhyUs = () => {
  return (
    <section className="bg-amber-50 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-amber-900 mb-12">
            What is The Student Sphere?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-amber-600 mb-4" size={50} />,
                title: "House and Landlord Ratings",
                description: "Housing options strategically located near universities and campuses."
              },
              {
                icon: <Check className="text-amber-600 mb-4" size={50} />,
                title: "Review your lease",
                description: "Designed to foster student connections and collaborative living."
              },
              {
                icon: <MapPin className="text-amber-600 mb-4" size={50} />,
                title: "Heat Map",
                description: "Every property is carefully vetted for quality and student needs."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-lg transition"
              >
                {feature.icon}
                <h4 className="text-2xl font-bold text-amber-900 mb-4">
                  {feature.title}
                </h4>
                <p className="text-amber-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default WhyUs
