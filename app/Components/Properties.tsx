import React from 'react'
import { Star } from 'lucide-react';

const Properties = () => {

    const featuredProperties = [
        {
          id: 1,
          name: "University Apartments",
          description: "Modern studio apartments near campus",
          rating: 4.8,
          price: 1200,
          image: "/api/placeholder/400/250"
        },
        {
          id: 2,
          name: "Campus View Residence",
          description: "Shared apartments with study spaces",
          rating: 4.6,
          price: 950,
          image: "/api/placeholder/400/250"
        },
        {
          id: 3,
          name: "Student Living Complex",
          description: "Full-service student housing",
          rating: 4.9,
          price: 1350,
          image: "/api/placeholder/400/250"
        }
      ];


  return (
    <section className="container mx-auto px-4 py-16 relative z-10">
        <h3 className="text-4xl font-bold text-center text-amber-900 mb-10">
          Featured Properties
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div 
              key={property.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <img 
                src={property.image} 
                alt={property.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-2xl font-bold text-amber-800 mb-2">
                  {property.name}
                </h4>
                <p className="text-amber-600 mb-4">
                  {property.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-2" size={20} />
                    <span className="font-semibold">{property.rating}</span>
                  </div>
                  <div className="text-xl font-bold text-amber-700">
                    ${property.price}/month
                  </div>
                </div>
                <button className="mt-4 w-full bg-amber-600 text-white py-2 rounded-full hover:bg-amber-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}

export default Properties
