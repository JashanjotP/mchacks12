'use client'

import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import NavbarTrans from '../Components/NavbarTrans';
import Footer from '../Components/Footer';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import app from "@/firebase/config";

const db = getFirestore(app);

interface PropertyListing {
  id: string;
  name: string;
  photo: string;
  location: string;
  rating: number;
  reviews: number;
  avgRent: number;
  features: string[];
  landlord: string;
}

const PropertyRatings = () => {
  const [filterLocation, setFilterLocation] = useState('');
  const [propertyListings, setPropertyListings] = useState<PropertyListing[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get all houses
        const housesCollection = collection(db, 'house');
        const housesSnapshot = await getDocs(housesCollection);
        
        const listings = await Promise.all(housesSnapshot.docs.map(async (houseDoc) => {
          const houseData = houseDoc.data();
          
          // Get reviews for this house
          const reviewsCollection = collection(db, 'house', houseDoc.id, 'reviews');
          const reviewsSnapshot = await getDocs(reviewsCollection);
          
          let totalHouseRating = 0;
          let totalLandlordRating = 0;
          const reviews = reviewsSnapshot.docs.length;
          
          reviewsSnapshot.docs.forEach((reviewDoc) => {
            const reviewData = reviewDoc.data();
            totalHouseRating += reviewData.houseRating || 0;
            totalLandlordRating += reviewData.landlordRating || 0;
          });

          const avgHouseRating = reviews > 0 ? totalHouseRating / reviews : 0;
          const avgLandlordRating = reviews > 0 ? totalLandlordRating / reviews : 0;
          
          // Get latest review for rent and tags
          const latestReviewQuery = query(
            collection(db, 'house', houseDoc.id, 'reviews'),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const latestReviewSnapshot = await getDocs(latestReviewQuery);
          const latestReview = latestReviewSnapshot.docs[0]?.data();

          return {
            id: houseDoc.id,
            name: houseData.address,
            photo: houseData.imageUrl || "/house.png", // You might want to store actual photos in Firebase Storage
            location: houseData.location || "Location not specified",
            rating: avgHouseRating,
            reviews: reviews,
            avgRent: latestReview?.rent || 0,
            features: latestReview?.tags || [],
            landlord: houseData.landlord
          };
        }));

        setPropertyListings(listings);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Filtering logic
  const filteredListings = propertyListings.filter(listing => 
    !filterLocation || 
    listing.name.toLowerCase().includes(filterLocation.toLowerCase())
  );

  return (
    <>
    <NavbarTrans/>
    <div className="min-h-screen bg-[#f1f0e8] p-8">
      <div className="container mx-auto my-20">
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
              onClick={() => window.location.href = `/ratingpage/${listing.id}`}
              className="bg-[#f9f9f6] rounded-2xl shadow-md hover:shadow-lg transition grid grid-cols-[300px_1fr] overflow-hidden cursor-pointer" 
            >
              {/* Property Photo */}
              <div className="w-full h-auto p-5 flex justify-center">
                <img 
                    src={listing.photo} 
                    alt={listing.name} 
                    className="w-55 h-40 border border-gray object-cover rounded-xl"
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
        <div className="mt-10 text-right">
          <a href="/ratingpage/upload">
            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-800">
              Create New Review
            </button>
          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PropertyRatings;