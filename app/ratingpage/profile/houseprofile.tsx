'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import NavbarTrans from '@/app/Components/NavbarTrans';
import Footer from '@/app/Components/Footer';

const HouseProfilePage = () => {
  // Sample data - replace with actual data from your application
  const [houseData] = useState({
    houseName: "Sunset Apartments",
    labels: ["Cozy", "Modern", "Pet-Friendly"],
    landlordName: "David Thompson",
    houseRating: 8.7,
    landlordRating: 9.2,
    reviews: [
      {
        id: 1,
        userName: "Emma Johnson",
        rating: 9,
        landlordRating: 6,
        description: "Absolutely loved the spacious living areas and modern amenities. A perfect retreat!",
        price: 0,
        date: "2024-01-15"
      },
      {
        id: 2,
        userName: "Alex Rodriguez",
        rating: 7,
        landlordRating: 6,
        description: "Nice property with great views. Could use some minor updates in the kitchen.",
        price: 0,
        date: "2024-01-20"
      },
      {
        id: 3,
        userName: "Sarah Kim",
        rating: 8,
        landlordRating: 6,
        description: "Comfortable and well-maintained. The location is fantastic!",
        price: 0,
        date: "2024-01-22"
      }
    ]
  });

  // Function to generate rating distribution
  const generateRatingDistribution = () => {
    const ratingCounts = new Array(10).fill(0);
    houseData.reviews.forEach(review => {
      ratingCounts[review.rating - 1]++;
    });
    return ratingCounts;
  };

  const ratingDistribution = generateRatingDistribution();

  return (
    <div className=" min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* House Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-[#78350F]">{houseData.houseName}</h1>

          {/* Labels */}
          <div className="flex gap-2 mt-3 rounded-none">
            {houseData.labels.map((label) => (
              <Badge 
                key={label} 
                className="bg-[#FEF3C7] text-[#78350F] hover:bg-[#FEF3C7]"
              >
                {label}
              </Badge>
            ))}
          </div>

          {/* Landlord and Ratings */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#78350F]">Landlord: <span className="font-semibold">{houseData.landlordName}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[#78350F]">
                House Rating: <span className="font-bold text-[#D97706]">{houseData.houseRating}</span>
              </p>
              <p className="text-[#78350F]">
                Landlord Rating: <span className="font-bold text-[#D97706]">{houseData.landlordRating}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Ratings Distribution */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#78350F]">Ratings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end h-40 space-x-1">
              {ratingDistribution.map((count, index) => (
                <div key={index} className="flex flex-col items-center w-full group">
                  <div 
                    className={`w-full rounded-t-sm ${count > 0 ? 'bg-[#D97706]' : 'bg-gray-200'} 
                      group-hover:opacity-80 transition-all`}
                    style={{ 
                      height: `${Math.max(count * 20, 10)}px`,
                      minHeight: '10px'
                    }}
                  ></div>
                  <span className="text-xs mt-2 text-[#78350F]">{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#78350F]">All Reviews</CardTitle>
          </CardHeader>
          <div className="flex justify-between mx-8">
            <div className="flex space-x-5">
              <span className="text-[#78350F]">House</span>
              <span className="text-[#78350F]">Landlord</span>
            </div>
            <span className="text-[#78350F]">Price</span>
          </div>
          <CardContent>
            {houseData.reviews.map((review) => (
              <div 
                key={review.id} 
                className="border-b last:border-b-0 py-4 flex items-start space-x-4 rounded-lg px-2"
              >

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className='grid grid-cols-2 gap-5'>
                      <div className="bg-blue-100 text-2xl font-bold text-blue-800 p-2 rounded-lg inline-block shadow-md">
                        {review.rating.toFixed(1)}
                      </div>
                      <div className="bg-[#d9770675] text-2xl font-bold text-orange-800 p-2 rounded-lg inline-block shadow-md">
                        {review.landlordRating.toFixed(1)}
                      </div>
                    </div>
                    <div className="bg-green-200 text-2xl font-bold text-green-800 p-2 rounded-lg inline-block shadow-md">
                      {review.price.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-[#78350F] text-opacity-80">{review.description}</p>
                  <p className="text-sm text-[#78350F] text-opacity-60 mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HouseProfilePage;