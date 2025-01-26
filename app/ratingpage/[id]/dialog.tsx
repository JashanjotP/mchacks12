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

export function CreateReviewDialog({ houseData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');
  const [landlordRating, setlandlordRating] = useState('');
  const [landlordName, setlandlordName] = useState('');
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

        // Handle label selection
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
    rent: '',
    landlordRating: '',
    houseRating: '',
    labels: [],
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your review submission logic here
    console.log('Submitting review:', { houseData: houseData.houseName, rating, reviewText });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white hover:bg-blue-800">
            Create Review For {houseData.houseName}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Review for {houseData.houseName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input 
              id="rating"
              type="number" 
              min="1" 
              max="10" 
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Rate 1-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Landlord Name</Label>
            <Input 
              id="name"
              type="text" 
              value={landlordName}
              onChange={(e) => setlandlordName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Landlord Rating</Label>
            <Input 
              id="landlord-rating"
              type="text"
              value={landlordRating}
              onChange={(e) => setlandlordRating(Number(e.target.value))}
              placeholder="Rate 1-10"
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Price ($CAD) </Label>
            <Input 
              id="price"
              type="number"
              value={price}
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