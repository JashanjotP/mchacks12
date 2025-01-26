import React from 'react'
import { MapPin, Users, Check } from 'lucide-react'

const WhyUs = () => {
  return (
    <section className=" py-24 relative z-10 mx-5">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-amber-900 mb-12">
            What is The Student Sphere?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-amber-600 mb-4" size={50} />,
                title: "House and Landlord Ratings",
                description: "Verify your University email to leave reviews of your landlord and house."
              },
              {
                icon: <Check className="text-amber-600 mb-4" size={50} />,
                title: "Review Your Lease",
                description: "Scan your lease for hidden clauses, fees, and tenant protections with ease."
              },
              {
                icon: <MapPin className="text-amber-600 mb-4" size={50} />,
                title: "Heat Map",
                description: "Visualize housing availability and rent prices in neighborhoods near your campus."
              }              
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#ecebe2] p-8 rounded-2xl text-center shadow-md hover:shadow-lg transition"
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
