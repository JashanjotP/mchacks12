'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import NavbarTrans from '@/app/Components/NavbarTrans';
import Footer from '@/app/Components/Footer';
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import app from "@/firebase/config";
import { CreateReviewDialog } from './dialog';
import { RatingBadge } from '@/app/Components/RatingBadge';
import { normalizeToFivePoint, ratingDistributionOutOfFive } from '@/lib/ratings';

const db = getFirestore(app);

const HouseProfilePage = ({ id }: { id: string }) => {
  const [houseData, setHouseData] = useState({
    houseName: "",
    labels: [],
    landlordName: "",
    houseRating: 0,
    landlordRating: 0,
    reviews: []
  });

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        // Get house document
        const houseId = id
        const houseDoc = await getDoc(doc(db, 'house', houseId)); // Replace HOUSE_ID with actual ID
        const houseData = houseDoc.data();

        // Get reviews collection
        const reviewsCollection = collection(db, 'house', houseId, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);

        // Calculate average ratings
        let totalHouseRating = 0;
        let totalLandlordRating = 0;
        const reviews = [];

        reviewsSnapshot.docs.forEach((reviewDoc) => {
          const reviewData = reviewDoc.data();
          const houseRating = normalizeToFivePoint(reviewData.houseRating || 0);
          const landlordRating = normalizeToFivePoint(reviewData.landlordRating || 0);
          totalHouseRating += houseRating;
          totalLandlordRating += landlordRating;

          reviews.push({
            id: reviewDoc.id,
            rating: houseRating,
            landlordRating,
            description: reviewData.description,
            price: reviewData.rent,
            date: reviewData.createdAt?.toDate().toISOString().split('T')[0] || ''
          });
        });

        const avgHouseRating = reviews.length > 0 ? totalHouseRating / reviews.length : 0;
        const avgLandlordRating = reviews.length > 0 ? totalLandlordRating / reviews.length : 0;

        // Get latest review for tags
        const latestReviewQuery = query(
          collection(db, 'house', houseId, 'reviews'),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const latestReviewSnapshot = await getDocs(latestReviewQuery);
        const latestReview = latestReviewSnapshot.docs[0]?.data();

        setHouseData({
          houseName: houseData.address || "",
          labels: latestReview?.tags || [],
          landlordName: houseData.landlord || "",
          houseRating: avgHouseRating,
          landlordRating: avgLandlordRating,
          reviews: reviews
        });

      } catch (error) {
        console.error("Error fetching house data:", error);
      }
    };

    fetchHouseData();
  }, []);

  const ratingDistribution = ratingDistributionOutOfFive(
    houseData.reviews.map((r) => r.rating)
  );
  const maxDistributionCount = Math.max(...ratingDistribution, 1);

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
            <div className="text-right space-y-2">
              <p className="text-[#78350F] text-sm">House rating</p>
              <RatingBadge rating={houseData.houseRating} />
              <p className="text-[#78350F] text-sm pt-1">Landlord rating</p>
              <RatingBadge rating={houseData.landlordRating} />
            </div>
          </div>
        </div>

        {/* Ratings Distribution */}
        <Card className="bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#78350F]">
              Ratings distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end h-40 space-x-1">
              {ratingDistribution.map((count, index) => (
                <div key={index} className="flex flex-col items-center w-full group">
                  <div 
                    className={`w-full rounded-t-sm ${count > 0 ? 'bg-[#D97706]' : 'bg-gray-200'} 
                      group-hover:opacity-80 transition-all`}
                    style={{
                      height: `${Math.max((count / maxDistributionCount) * 120, count > 0 ? 12 : 8)}px`,
                      minHeight: '8px',
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
                      <RatingBadge rating={review.rating} />
                      <RatingBadge rating={review.landlordRating} />
                    </div>
                    <div className="bg-green-200 text-2xl font-bold text-green-800 p-2 rounded-lg inline-block shadow-md">
                      ${review.price.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-[#78350F] text-opacity-80">{review.description}</p>
                  <p className="text-sm text-[#78350F] text-opacity-60 mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <CreateReviewDialog id={id} name={houseData.houseName} />
      </div>
    </div>
  );
}

export default HouseProfilePage;