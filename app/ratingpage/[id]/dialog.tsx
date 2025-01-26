import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { getFirestore, collection, addDoc, doc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import app from "@/firebase/config";

const db = getFirestore(app);

interface CreateReviewDialogProps {
  id: string;
  name: string;
}

export function CreateReviewDialog({ id, name }: CreateReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [landlordRating, setLandlordRating] = useState<number>(0);
  const [landlordName, setLandlordName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [tags, setTags] = useState(''); 

  // Predefined labels with colors
  const availableLabels = [
    { name: 'Spacious', color: '#FEF3C7' },
    { name: 'Modern appliances', color: '#D1FAE5' },
    { name: 'Pet-Friendly', color: '#DBEAFE' },
    { name: 'Great Location', color: '#FCE7F3' },
    { name: 'Newly renovated', color: '#FEF3C7' },
    { name: 'Poor Maintance', color: '#E5E7EB' },
    { name: 'Hidden fees', color: '#FDE68A' },
    { name: 'Parking issues', color: '#D1FAE5' },
    { name: 'Poor maintance', color: '#FEF3C7' },
    { name: 'Old appliances', color: '#D1FAE5' },
    { name: 'Lease restrictions', color: '#DBEAFE' },
  ];

  const toggleLabel = (label: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const [formData, setFormData] = useState({
    housePhotos: [],
    address: '',
    latitude: null,
    longitude: null,
    rent: '',
    landlordName: '',
    landlordRating: '',
    houseRating: '',
    labels: [] as string[],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const houseRef = doc(db, 'house', id);
      const reviewsCollectionRef = collection(houseRef, 'reviews');
      
      // Update landlord name if changed
      const houseDoc = await getDoc(houseRef);
      const houseData = houseDoc.data();
      if (houseData.landlord !== landlordName) {
        await updateDoc(houseRef, {
          landlord: landlordName
        });
      }

      await addDoc(reviewsCollectionRef, {
        createdAt: Timestamp.now(),
        description: reviewText,
        houseRating: rating,
        landlordRating: landlordRating,
        rent: price,
      });

      // Reset form and close dialog
      setRating(0);
      setPrice(0);
      setLandlordRating(0);
      setLandlordName('');
      setReviewText('');
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white hover:bg-blue-800">
            Create Review For {name}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Review for {name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input 
              id="rating"
              type="number" 
              min="1" 
              max="10" 
              value={rating || ''}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Rate 1-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="landlordName">Landlord Name</Label>
            <Input 
              id="landlordName"
              type="text" 
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="landlordRating">Landlord Rating</Label>
            <Input 
              id="landlord-rating"
              type="number"
              min="1"
              max="10"
              value={landlordRating || ''}
              onChange={(e) => setLandlordRating(Number(e.target.value))}
              placeholder="Rate 1-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price ($CAD)</Label>
            <Input 
              id="price"
              type="number"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Rent per room"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="review">Review Details</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>
          <Button type="submit" className="w-full">Submit Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}