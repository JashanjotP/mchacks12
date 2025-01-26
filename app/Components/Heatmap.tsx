"use client";
import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Circle, InfoWindow } from '@react-google-maps/api';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import app from "@/firebase/config";

const db = getFirestore(app);

const GuelphRentalHeatMap = ({ apiKey }: { apiKey: string }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['visualization'],
  });

  interface RentalData {
    lat: number;
    lng: number;
    price: number;
    rating: number;
    address: string;
  }

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [rentalData, setRentalData] = useState<RentalData[]>([]);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [selectedRental, setSelectedRental] = useState<RentalData | null>(null);

  useEffect(() => {
    if (isLoaded) {
      fetchRentalData();
    }
  }, [isLoaded]);

  const fetchRentalData = async () => {
    try {
      const housesCollection = collection(db, 'house');
      const housesSnapshot = await getDocs(housesCollection);
      
      const data: RentalData[] = await Promise.all(housesSnapshot.docs.map(async doc => {
        const houseData = doc.data();

        // Get latest review for rent
        const latestReviewQuery = query(
          collection(db, 'house', doc.id, 'reviews'),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const latestReviewSnapshot = await getDocs(latestReviewQuery);
        const latestReview = latestReviewSnapshot.docs[0]?.data();
        const price = latestReview?.rent || 0;

        // Get all reviews to calculate average rating
        const reviewsCollection = collection(db, 'house', doc.id, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        let totalRating = 0;
        const reviews = reviewsSnapshot.docs.length;
        
        reviewsSnapshot.docs.forEach((reviewDoc) => {
          const reviewData = reviewDoc.data();
          totalRating += reviewData.houseRating || 0;
        });

        const avgRating = reviews > 0 ? totalRating / reviews : 0;

        return {
          lat: houseData.location.latitude,
          lng: houseData.location.longitude,
          price: price,
          rating: avgRating,
          address: houseData.address || ""
        };
      }));

      setRentalData(data);
      setAveragePrice(calculateAveragePrice(data));
    } catch (error) {
      console.error("Error fetching rental data:", error);
    }
  };

  const calculateAveragePrice = (rentals: RentalData[]): number => {
    return rentals.reduce((sum, rental) => sum + rental.price, 0) / rentals.length;
  };

  const determinePriceBucket = (price: number): string => {
    const diff = price - averagePrice;
    const threshold = averagePrice * 0.2;

    if (diff < -threshold) return 'below average';
    if (diff < 0) return 'slightly below average';
    if (diff === 0) return 'average';
    if (diff <= threshold) return 'slightly above average';
    return 'above average';
  };

  const getPriceColor = (bucket: string): string => {
    const colorMap = {
      'below average': 'rgba(0, 255, 0, 0.7)',
      'slightly below average': 'rgba(100, 255, 100, 0.7)',
      'average': 'rgba(255, 255, 0, 0.7)',
      'slightly above average': 'rgba(255, 100, 100, 0.7)',
      'above average': 'rgba(255, 0, 0, 0.7)',
    };
    return colorMap[bucket as keyof typeof colorMap];
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ height: '600px', width: '100%' }}
      zoom={12}
      center={{ lat: 43.5448, lng: -80.2482 }}
      onLoad={(map) => setMap(map)}
    >
      {rentalData.map((rental, index) => {
        const priceBucket = determinePriceBucket(rental.price);
        const color = getPriceColor(priceBucket);

        return (
          <div key={index}>
            <Circle
              center={{ lat: rental.lat, lng: rental.lng }}
              radius={25}
              options={{
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.35,
              }}
              onClick={() => setSelectedRental(rental)}
            />
            {selectedRental === rental && (
              <InfoWindow
                position={{ lat: rental.lat, lng: rental.lng }}
                onCloseClick={() => setSelectedRental(null)}
              >
                <div style={{ fontSize: '0.9em', maxWidth: '200px' }}>
                  <strong>Address:</strong> {rental.address}<br />
                  <strong>Price:</strong> ${rental.price.toFixed(2)}<br />
                  <strong>Rating:</strong> {rental.rating.toFixed(1)}/10.0<br />
                  <strong>Price Category:</strong> {priceBucket}
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </GoogleMap>
  );
};

export default GuelphRentalHeatMap;