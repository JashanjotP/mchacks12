'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'
import { ChevronDown, ChevronUp, ImagePlus, Info, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { collection, doc, GeoPoint, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import app from '@/firebase/config'
import { BlockRating } from './components/BlockRating'
import { FormSection } from './components/FormSection'
import { fetchPropertyPhotoUrl } from '@/lib/google-place-photo'
import {
  GOOGLE_MAPS_LIBRARIES,
  GUELPH_ADDRESS_OPTIONS,
} from '@/lib/google-maps'

const MIN_MONTHLY_RENT = 200

const UNIT_TYPES = [
  'Full house',
  'Upper / lower unit',
  'Basement apartment',
  'Room in shared house',
  'Other',
] as const

const AVAILABLE_TAGS = [
  'Spacious',
  'Modern appliances',
  'Pet-friendly',
  'Great location',
  'Newly renovated',
  'Responsive landlord',
  'Quiet neighborhood',
  'Utilities included',
  'Poor maintenance',
  'Hidden fees',
  'Parking issues',
  'Slow repairs',
  'Old appliances',
  'Lease restrictions',
  'Loud neighbors',
  'Mold / pests',
] as const

type FormData = {
  housePhotos: File[]
  placePhotoUrl: string | null
  address: string
  latitude: number | null
  longitude: number | null
  rent: string
  landlordName: string
  unitType: string
  landlordRating: number
  houseRating: number
  labels: string[]
  description: string
}

type FormErrors = {
  address?: string
  unitType?: string
  rent?: string
  landlordName?: string
  houseRating?: string
  landlordRating?: string
  labels?: string
  description?: string
  submit?: string
}

const initialFormData: FormData = {
  housePhotos: [],
  placePhotoUrl: null,
  address: '',
  latitude: null,
  longitude: null,
  rent: '',
  landlordName: '',
  unitType: '',
  landlordRating: 0,
  houseRating: 0,
  labels: [],
  description: '',
}

const ReviewUploadPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setFormData((prev) => ({ ...prev, address: q }))
    }
  }, [])

  const clearError = (field: keyof FormErrors) => {
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearError(name as keyof FormErrors)
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace()
    if (place?.geometry?.location) {
      const placePhotoUrl =
        place.photos?.[0]?.getUrl({ maxWidth: 800 }) ?? null
      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address || '',
        latitude: place.geometry!.location!.lat(),
        longitude: place.geometry!.location!.lng(),
        placePhotoUrl,
      }))
      clearError('address')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validImageFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )

    if (validImageFiles.length + formData.housePhotos.length > 5) {
      alert('You can upload a maximum of 5 images')
      return
    }

    setFormData((prev) => ({
      ...prev,
      housePhotos: [...prev.housePhotos, ...validImageFiles],
    }))
  }

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      housePhotos: prev.housePhotos.filter((_, index) => index !== indexToRemove),
    }))
  }

  const toggleLabel = (label: string) => {
    setFormData((prev) => {
      const selected = prev.labels.includes(label)
      if (selected) {
        return { ...prev, labels: prev.labels.filter((l) => l !== label) }
      }
      if (prev.labels.length >= 3) return prev
      return { ...prev, labels: [...prev.labels, label] }
    })
    clearError('labels')
  }

  const validateForm = () => {
    const errors: FormErrors = {}

    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.unitType) errors.unitType = 'Please select a unit type'
    if (!formData.landlordName.trim()) errors.landlordName = 'Landlord name is required'
    const rentAmount = Number(formData.rent)
    if (!formData.rent.trim() || Number.isNaN(rentAmount)) {
      errors.rent = 'Enter a valid monthly rent'
    } else if (rentAmount < MIN_MONTHLY_RENT) {
      errors.rent = `Monthly rent must be at least $${MIN_MONTHLY_RENT}`
    }
    if (formData.houseRating < 1 || formData.houseRating > 5) {
      errors.houseRating = 'Rate the house from 1 to 5'
    }
    if (formData.landlordRating < 1 || formData.landlordRating > 5) {
      errors.landlordRating = 'Rate the landlord from 1 to 5'
    }
    if (formData.labels.length === 0) {
      errors.labels = 'Select at least one tag (up to 3)'
    }
    if (!formData.description.trim()) {
      errors.description = 'Write a short review for other students'
    }
    if (formData.latitude === null || formData.longitude === null) {
      errors.address = 'Pick an address from the suggestions so we can place it on the map'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const db = getFirestore(app)
      const houseRef = doc(collection(db, 'house'))

      let imageUrl = ''
      if (formData.housePhotos.length > 0) {
        const imageUrls = await Promise.all(
          formData.housePhotos.map(async (file) => {
            const body = new FormData()
            body.append('file', file)
            const response = await fetch('/api/upload', { method: 'PUT', body })
            const blob = await response.json()
            return blob.url as string
          })
        )
        imageUrl = imageUrls[0]
      } else if (formData.placePhotoUrl) {
        imageUrl = formData.placePhotoUrl
      } else if (
        formData.latitude !== null &&
        formData.longitude !== null
      ) {
        imageUrl =
          (await fetchPropertyPhotoUrl(
            formData.latitude,
            formData.longitude,
            formData.address
          )) ?? ''
      }

      await setDoc(houseRef, {
        address: formData.address,
        landlord: formData.landlordName,
        location: new GeoPoint(formData.latitude!, formData.longitude!),
        imageUrl,
      })

      const reviewRef = doc(collection(houseRef, 'reviews'))
      await setDoc(reviewRef, {
        createdAt: serverTimestamp(),
        description: formData.description,
        houseRating: formData.houseRating,
        landlordRating: formData.landlordRating,
        rent: parseFloat(formData.rent),
        tags: formData.labels,
        unitType: formData.unitType,
      })

      window.location.href = '/ratingpage'
    } catch (error) {
      console.error('Error submitting review:', error)
      setFormErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-[#ececeb] min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* RMP-style page header */}
        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {formData.address.trim() ? formData.address.split(',')[0] : 'Add a house'}
          </h1>
          <p className="text-xl text-gray-700">Add rating</p>
          <p className="text-sm text-gray-500">
            {formData.address.trim()
              ? formData.address
              : 'Guelph student housing · StudentSphere'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property details — like "Select course code" */}
          <FormSection title="Property details" required>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-gray-800 font-medium">
                  House address<span className="text-red-500">*</span>
                </Label>
                {loadError ? (
                  <p className="text-sm text-amber-800 mt-2">
                    Address search unavailable — type the full address manually.
                  </p>
                ) : null}
                <Autocomplete
                  onLoad={(ac) => {
                    autocompleteRef.current = ac
                  }}
                  onPlaceChanged={handlePlaceSelect}
                  options={GUELPH_ADDRESS_OPTIONS}
                >
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Start typing an address in Guelph…"
                    className={`mt-2 ${formErrors.address ? 'border-red-500' : ''}`}
                  />
                </Autocomplete>
                {formErrors.address ? (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="unitType" className="text-gray-800 font-medium">
                  Unit type<span className="text-red-500">*</span>
                </Label>
                <select
                  id="unitType"
                  name="unitType"
                  aria-label="Unit type"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  className={`mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    formErrors.unitType ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select unit type</option>
                  {UNIT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.unitType ? (
                  <p className="text-red-500 text-sm mt-1">{formErrors.unitType}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent" className="text-gray-800 font-medium">
                    Monthly rent (CAD)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rent"
                    type="number"
                    name="rent"
                    min={MIN_MONTHLY_RENT}
                    value={formData.rent}
                    onChange={handleInputChange}
                    placeholder="e.g. 650 (min $200)"
                    className={`mt-2 ${formErrors.rent ? 'border-red-500' : ''}`}
                  />
                  {formErrors.rent ? (
                    <p className="text-red-500 text-sm mt-1">{formErrors.rent}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="landlordName" className="text-gray-800 font-medium">
                    Landlord name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="landlordName"
                    type="text"
                    name="landlordName"
                    value={formData.landlordName}
                    onChange={handleInputChange}
                    placeholder="Company or person"
                    className={`mt-2 ${formErrors.landlordName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.landlordName ? (
                    <p className="text-red-500 text-sm mt-1">{formErrors.landlordName}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </FormSection>

          {/* Rate house */}
          <FormSection title="Rate this house" required>
            <BlockRating
              value={formData.houseRating}
              onChange={(n) => {
                setFormData((prev) => ({ ...prev, houseRating: n }))
                clearError('houseRating')
              }}
              lowLabel="Awful"
              highLabel="Awesome"
              error={formErrors.houseRating}
            />
          </FormSection>

          {/* Rate landlord */}
          <FormSection title="Rate your landlord" required>
            <BlockRating
              value={formData.landlordRating}
              onChange={(n) => {
                setFormData((prev) => ({ ...prev, landlordRating: n }))
                clearError('landlordRating')
              }}
              lowLabel="Awful"
              highLabel="Great"
              error={formErrors.landlordRating}
            />
          </FormSection>

          {/* Tags — up to 3 like RMP */}
          <FormSection title="Select up to 3 tags" required>
            <p className="text-sm text-gray-500 -mt-2 mb-3">
              {formData.labels.length}/3 selected
            </p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const selected = formData.labels.includes(tag)
                const disabled = !selected && formData.labels.length >= 3
                return (
                  <button
                    key={tag}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleLabel(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selected
                        ? 'bg-gray-900 text-white border-gray-900'
                        : disabled
                          ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            {formErrors.labels ? (
              <p className="text-red-500 text-sm mt-2">{formErrors.labels}</p>
            ) : null}
          </FormSection>

          {/* Written review */}
          <FormSection title="Write a review" required>
            <p className="text-sm text-gray-600 -mt-2 mb-3">
              Share the condition of the unit, how the landlord handles maintenance, and
              anything future tenants should know.
            </p>

            <button
              type="button"
              onClick={() => setGuidelinesOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 mb-3"
            >
              <span className="flex items-center gap-2">
                <Info size={16} className="text-gray-500" />
                Guidelines
              </span>
              {guidelinesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {guidelinesOpen ? (
              <ul className="text-sm text-gray-600 space-y-1 mb-4 list-disc pl-5">
                <li>Be honest and specific — mention rent, lease terms, and upkeep.</li>
                <li>Do not include personal contact info or full names of roommates.</li>
                <li>Focus on the housing experience, not unrelated disputes.</li>
              </ul>
            ) : null}

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What do you want other students to know about living here?"
              className={`min-h-[140px] resize-y ${formErrors.description ? 'border-red-500' : ''}`}
            />
            {formErrors.description ? (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            ) : null}
          </FormSection>

          {/* Photos — optional */}
          <FormSection title="Add photos (optional)">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload house photos"
            />
            {formData.housePhotos.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-colors"
              >
                <div className="flex flex-col items-center text-gray-600">
                  <ImagePlus size={28} className="mb-2 text-gray-400" />
                  <p className="text-sm">Click to upload up to 5 photos</p>
                </div>
              </button>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.housePhotos.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        aria-label={`Remove photo ${index + 1}`}
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {formData.housePhotos.length < 5 ? (
                    <button
                      type="button"
                      aria-label="Add another photo"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-amber-400"
                    >
                      <ImagePlus className="text-gray-400" size={20} />
                    </button>
                  ) : null}
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {formData.housePhotos.length} photos
                </p>
              </div>
            )}
          </FormSection>

          {formErrors.submit ? (
            <p className="text-red-600 text-sm text-center">{formErrors.submit}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-md"
          >
            {isSubmitting ? 'Submitting…' : 'Submit rating'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ReviewUploadPage
