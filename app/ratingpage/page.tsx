'use client'

import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import NavbarTrans from '../Components/NavbarTrans';
import Footer from '../Components/Footer';

const PropertyRatings = () => {
  const [filterLocation, setFilterLocation] = useState('');

  // Mock data for properties
  const propertyListings = [
    {
      id: 1,
      name: "210 Farley Drive",
      photo: "/api/placeholder/300/200",
      location: "South Guelph",
      rating: 9.4,
      reviews: 21,
      avgRent: 1250,
      features: ['Responsive Landlord', 'Newly renovated'],
      landlord: "Scottie Barnes"
    },
    {
      id: 2,
      name: "1055 Gordon Street",
      photo: "/api/placeholder/300/200",
      location: "South Guelph",
      rating: 7.6,
      reviews: 14,
      avgRent: 1000,
      features: ['Great Location', 'Heating Problems'],
      landlord: "DeMarcus Cousins"
    },
    {
      id: 3,
      name: "102 McKinnon Street",
      photo: "/api/placeholder/300/200",
      location: "Downtown",
      rating: 5.8,
      reviews: 210,
      avgRent: 950,
      features: ['Poor Maintance', 'Water Leaks'],
      landlord: "Michaela Hilston"
    }
  ];

  // Filtering logic
  const filteredListings = propertyListings.filter(listing => 
    !filterLocation || 
    listing.location.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <>
    <NavbarTrans/>
    <div className="min-h-screen bg-[#f1f0e8] p-8">
      <div className="container mx-auto mt-20">
        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          Property Ratings
        </h1>

        {/* Location Filter */}
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text"
              placeholder="Filter by Location"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-96"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
          </div>
        </div>

        {/* Property Listings */}
        <div className="space-y-6">
          {filteredListings.map((listing) => (
            <div 
              key={listing.id} 
              className="bg-[#f9f9f6] rounded-2xl shadow-md hover:shadow-lg transition grid grid-cols-[300px_1fr] overflow-hidden"
            >
              {/* Property Photo */}
              <div className="w-full h-full p-5 ">
                <img 
                  src={listing.photo} 
                  alt={listing.name} 
                  className="w-full h-full border border-gray object-cover rounded-xl"
                />
              </div>

              {/* Property Details */}
              <div className="p-6 relative">
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-amber-900">
                    {listing.name}
                  </h2>
                  
                  {/* Average Rating */}
                  <div className="text-right">
                    <div className="bg-blue-200 text-3xl font-bold text-blue-800 p-2 rounded-lg inline-block shadow-md">
                        {listing.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Feature Labels */}
                <div className="flex space-x-2 mb-4">
                  {listing.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="bg-[#FEF3C7] text-[#78350F] rounded-lg px-5 py-3 text-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Location and Additional Details */}
                <div className="text-amber-700">
                  <p>{listing.landlord}</p>
                </div>

                {/* Average Rent */}
                <div className="absolute bottom-6 right-6 text-right">
                  <p className="text-2xl font-bold text-amber-800">
                    ${listing.avgRent}
                    <span className="text-sm text-amber-600 block">avg/month</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PropertyRatings;