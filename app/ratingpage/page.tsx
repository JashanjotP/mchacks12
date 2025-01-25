'use client'

import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';

const PropertyRatings = () => {
  const [filterLocation, setFilterLocation] = useState('');

  // Mock data for properties
  const propertyListings = [
    {
      id: 1,
      name: "University Terrace Apartments",
      photo: "/api/placeholder/300/200",
      location: "Near State University",
      rating: 4.6,
      reviews: 128,
      avgRent: 1250,
      features: ['WiFi', 'Gym'],
      landlord: "Campus Housing Inc."
    },
    {
      id: 2,
      name: "Student Living Complex",
      photo: "/api/placeholder/300/200",
      location: "Downtown Campus Area",
      rating: 4.3,
      reviews: 95,
      avgRent: 1100,
      features: ['Study Rooms', 'Kitchen'],
      landlord: "Academic Residences LLC"
    },
    {
      id: 3,
      name: "Campus View Residence",
      photo: "/api/placeholder/300/200",
      location: "University District",
      rating: 4.8,
      reviews: 210,
      avgRent: 1350,
      features: ['Gym', 'Parking'],
      landlord: "Student Housing Solutions"
    }
  ];

  // Filtering logic
  const filteredListings = propertyListings.filter(listing => 
    !filterLocation || 
    listing.location.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          Property Ratings
        </h1>

        {/* Location Filter */}
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text"
              placeholder="Filter by Location"
              className="pl-10 pr-4 py-2 border rounded-full w-full md:w-96"
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
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition grid grid-cols-[300px_1fr] overflow-hidden"
            >
              {/* Property Photo */}
              <div className="w-full h-full">
                <img 
                  src={listing.photo} 
                  alt={listing.name} 
                  className="w-full h-full object-cover"
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
                    <div className="text-3xl font-bold text-amber-800">
                      {listing.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-end">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`${star <= Math.round(listing.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill="currentColor"
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feature Labels */}
                <div className="flex space-x-2 mb-4">
                  {listing.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Location and Additional Details */}
                <div className="text-amber-700">
                  <p>{listing.landlord}</p>
                  <p>{listing.location}</p>
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
  );
};

export default PropertyRatings;