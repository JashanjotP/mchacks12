'use client'

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImagePlus, X } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { collection, doc, GeoPoint, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import app from '@/firebase/config';

const ReviewUploadPage = () => {
  const [formData, setFormData] = useState({
    housePhotos: [],
    address: '',
    latitude: null,
    longitude: null,
    rent: '',
    landlordName: '',
    landlordRating: '',
    houseRating: '',
    labels: [],
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

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

  // Handle input changes (same as previous implementation)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle place selection from Google Maps Autocomplete
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      setFormData(prev => ({
        ...prev,
        address: place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng()
      }));
    }
  };

  // Handle file uploads (same as previous implementation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImageFiles.length + formData.housePhotos.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }

    setFormData(prev => ({
      ...prev,
      housePhotos: [...prev.housePhotos, ...validImageFiles]
    }));
  };

  // Remove uploaded image
  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      housePhotos: prev.housePhotos.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Handle label selection
  const toggleLabel = (label: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  // Validation function (same as previous implementation)
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.landlordName.trim()) {
      errors.landlordName = 'Landlord name is required';
    }

    const rating = (value: string) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 1 && num <= 10;
    };

    if (!rating(formData.landlordRating)) {
      errors.landlordRating = 'Rating must be between 1 and 10';
    }

    if (!rating(formData.houseRating)) {
      errors.houseRating = 'Rating must be between 1 and 10';
    }

    if (formData.labels.length === 0) {
      errors.labels = 'Please select at least one label';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if(!formData.rent.trim()){
      errors.rent = "Rent is required"
    }

    if (!formData.housePhotos) {
        console.log("optional");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Get reference to Firestore
        const db = getFirestore(app);

        // Create house document with auto ID
        const houseRef = doc(collection(db, "house"));
        await setDoc(houseRef, {
          address: formData.address,
          landlord: formData.landlordName,
          location: new GeoPoint(formData.latitude, formData.longitude)
        });

        // Add review as subcollection document
        const reviewRef = doc(collection(houseRef, "reviews"));
        await setDoc(reviewRef, {
          createdAt: serverTimestamp(),
          description: formData.description,
          houseRating: parseFloat(formData.houseRating),
          landlordRating: parseFloat(formData.landlordRating), 
          rent: parseFloat(formData.rent),
          tags: formData.labels
        });

        // Reset form after successful submission
        setFormData({
          housePhotos: [],
          address: '',
          latitude: null,
          longitude: null,
          rent: '',
          landlordName: '',
          landlordRating: '',
          houseRating: '',
          labels: [],
          description: ''
        });

        console.log('Successfully submitted review');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#f5f5f4] min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-[#FEF3C7] py-4">
            <CardTitle className="text-[#78350F] text-2xl font-bold">
              Upload House Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* House Photos Upload */}
              <div>
                <Label className="text-[#78350F] font-semibold">House Photos</Label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  multiple 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  onClick={triggerFileInput}
                  className="mt-2 border-2 border-dashed border-[#D97706] rounded-lg p-4 text-center cursor-pointer hover:bg-[#FDE68A]/20 transition-colors"
                >
                  {formData.housePhotos.length === 0 ? (
                    <div className="flex flex-col items-center text-[#78350F]">
                      <ImagePlus size={32} className="mb-2 text-[#D97706]" />
                      <p>Click to upload images (Max 5)</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {formData.housePhotos.map((file, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-md group-hover:opacity-70 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {formData.housePhotos.length < 5 && (
                        <div 
                          onClick={triggerFileInput}
                          className="w-20 h-20 border-2 border-dashed border-[#D97706] rounded-md flex items-center justify-center text-[#78350F] cursor-pointer hover:bg-[#FDE68A]/20"
                        >
                          <ImagePlus className="text-[#D97706]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {formErrors.housePhotos && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.housePhotos}</p>
                )}
              </div>

              {/* Address with Google Maps Autocomplete */}
              <div>
                <Label className="text-[#78350F] font-semibold">House Address</Label>
                <Autocomplete
                  onLoad={autocomplete => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect}
                  restrictions={{ country: "ca" }}
                >
                  <Input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter house address in the city"
                    className={`mt-2 focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.address ? 'border-red-500' : ''}`}
                  />
                </Autocomplete>
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}
              
              </div>

              {/* Landlord Name */}
              <div className="flex justify-between gap-4">
                <div className="w-1/2">
                  <Label className="text-[#78350F] font-semibold">Landlord Name</Label>
                  <Input 
                    type="text" 
                    name="landlordName"
                    value={formData.landlordName}
                    onChange={handleInputChange}
                    placeholder="Enter landlord's name"
                    className={`mt-2 focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.landlordName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.landlordName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.landlordName}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <Label className="text-[#78350F] font-semibold">Rent</Label>
                  <Input 
                    type="number" 
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    placeholder="Enter rent amount"
                    className={`mt-2 focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.rent ? 'border-red-500' : ''}`}
                  />
                  {formErrors.rent && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.rent}</p>
                  )}
                </div>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#78350F] font-semibold">Landlord Rating</Label>
                  <Input 
                    type="number" 
                    name="landlordRating"
                    value={formData.landlordRating}
                    onChange={handleInputChange}
                    min="1" 
                    max="10"
                    placeholder="1-10"
                    className={`mt-2 focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.landlordRating ? 'border-red-500' : ''}`}
                  />
                  {formErrors.landlordRating && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.landlordRating}</p>
                  )}
                </div>
                <div>
                  <Label className="text-[#78350F] font-semibold">House Rating</Label>
                  <Input 
                    type="number" 
                    name="houseRating"
                    value={formData.houseRating}
                    onChange={handleInputChange}
                    min="1" 
                    max="10"
                    placeholder="1-10"
                    className={`mt-2 focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.houseRating ? 'border-red-500' : ''}`}
                  />
                  {formErrors.houseRating && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.houseRating}</p>
                  )}
                </div>
              </div>

              {/* Labels */}
              <div>
                <Label className="text-[#78350F] mb-2 block font-semibold">Select Labels</Label>
                <div className="flex flex-wrap gap-2">
                  {availableLabels.map((label) => (
                    <Badge 
                      key={label.name}
                      onClick={() => toggleLabel(label.name)}
                      style={{
                        backgroundColor: formData.labels.includes(label.name) 
                          ? '#D97706' 
                          : label.color,
                      }}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.labels.includes(label.name)
                          ? 'text-white' 
                          : 'text-[#78350F] hover:bg-opacity-80'
                      }`}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
                {formErrors.labels && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.labels}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="text-[#78350F] font-semibold">Review Description</Label>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this house"
                  className={`mt-2 min-h-[120px] focus:border-[#D97706] focus:ring-[#D97706] ${formErrors.description ? 'border-red-500' : ''}`}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="button" 
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white transition-colors duration-300 transform hover:scale-[1.02]"
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ReviewUploadPage;