'use client'

import React, { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'
import {
  GOOGLE_MAPS_LIBRARIES,
  GUELPH_ADDRESS_OPTIONS,
} from '@/lib/google-maps'

const goToRatings = (address: string) => {
  const q = address.trim()
  if (!q) return
  window.location.href = `/ratingpage?q=${encodeURIComponent(q)}`
}

const FEATURES = [
  {
    image: '/pencil.png',
    title: 'Manage and edit your ratings',
    blob: 'bg-amber-100/90',
  },
  {
    image: '/anon.png',
    title: 'Rate anonymously',
    blob: 'bg-pink-100/90',
  },
  {
    image: '/dislike.png',
    title: 'Like or dislike ratings',
    blob: 'bg-sky-100/90',
  },
] as const

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const desktopAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mobileAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const applySelectedPlace = useCallback(
    (ref: React.MutableRefObject<google.maps.places.Autocomplete | null>) => {
      const place = ref.current?.getPlace()
      const addr = place?.formatted_address
      if (addr) setSearchQuery(addr)
    },
    []
  )

  const handleSearch = () => goToRatings(searchQuery)
  const searchDisabled = !searchQuery.trim()

  const desktopInput = (
    <input
      type="text"
      placeholder="Search an address in Guelph"
      className="w-full min-w-0 bg-transparent px-6 py-4 text-lg text-gray-700 outline-none placeholder:text-gray-400"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSearch()
      }}
    />
  )

  const mobileInput = (
    <input
      type="text"
      placeholder="Search an address in Guelph"
      className="w-full min-w-0 bg-transparent px-4 py-3 text-base text-gray-700 outline-none placeholder:text-gray-400"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSearch()
      }}
    />
  )

  const searchError = loadError ? (
    <p className="mt-2 text-sm text-amber-900/80">
      Address search is unavailable. Check your Google Maps API key and Places API.
    </p>
  ) : null

  return (
    <>
      <header
        className="relative z-10 mx-4 overflow-visible bg-amber-100/90 px-6 pb-10 pt-24 shadow-md backdrop-blur-sm md:mx-5 md:px-8 md:pb-24 md:pt-28"
        style={{
          borderBottomLeftRadius: '2rem',
          borderBottomRightRadius: '2rem',
        }}
      >
        <div className="mt-6 grid grid-cols-1 items-center gap-6 md:container md:mx-auto md:mt-8 md:grid-cols-2 md:items-start md:gap-12">
          {/* Left: title + search */}
          <div className="min-w-0 space-y-5 md:space-y-8">
            <h2 className="hero-title text-3xl leading-tight text-amber-900 sm:text-4xl md:text-5xl">
              A Housing Community
              <br />
              for students, empowered
              <br />
              by{' '}
              <span className="relative inline-block">
                <span className="font-semibold italic text-amber-500">verified students!</span>
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full md:-bottom-3 md:h-4"
                  viewBox="0 0 300 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M5 14C30 6 80 4 150 10C220 16 270 12 295 8"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="animate-draw"
                  />
                </svg>
              </span>
            </h2>

            <ul className="hidden space-y-2 text-base text-amber-800 opacity-80 md:block md:text-xl">
              <li>✔️ Analyze your lease for hidden fees and risks.</li>
              <li>✔️ Compare the cheapest rents near you.</li>
              <li>✔️ Read real reviews from real people!</li>
            </ul>

            <div className="relative hidden w-full min-w-0 pb-1 md:block">
              <div className="rounded-full shadow-lg">
                <div className="flex min-h-[3.25rem] w-full min-w-0 items-center rounded-full bg-white ring-1 ring-black/5">
                  {isLoaded ? (
                    <Autocomplete
                      className="min-w-0 flex-1 [&_input]:w-full"
                      onLoad={(ac) => {
                        desktopAutocompleteRef.current = ac
                      }}
                      onPlaceChanged={() => applySelectedPlace(desktopAutocompleteRef)}
                      options={GUELPH_ADDRESS_OPTIONS}
                    >
                      {desktopInput}
                    </Autocomplete>
                  ) : (
                    <div className="min-w-0 flex-1">{desktopInput}</div>
                  )}
                  <button
                    type="button"
                    aria-label="Search addresses"
                    disabled={searchDisabled}
                    className="m-1.5 shrink-0 rounded-full bg-gray-900 p-3.5 text-white transition-all hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50"
                    onClick={handleSearch}
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
              {searchError}
            </div>
          </div>

          {/* Right: hero photos (desktop) */}
          <div className="relative hidden h-[350px] grid-cols-2 grid-rows-2 gap-3 md:grid md:gap-4 lg:h-[450px]">
            <img
              src="/girls.jpeg"
              alt="Students in student housing"
              className="z-30 col-span-1 row-span-2 h-full w-full rounded-2xl object-cover shadow-lg transition-transform duration-300 ease-in-out hover:rotate-[-5deg]"
            />
            <img
              src="/us.jpeg"
              alt="Students reviewing housing"
              className="z-20 col-span-1 row-span-1 h-full w-full rounded-2xl object-cover shadow-lg transition-transform duration-300 ease-in-out hover:rotate-[-5deg]"
            />
            <img
              src="/2guys.jpeg"
              alt="Students near campus housing"
              className="z-10 col-span-1 row-span-1 h-full w-full rounded-2xl object-cover shadow-lg transition-transform duration-300 ease-in-out hover:rotate-[-5deg]"
            />
          </div>

          {/* Mobile hero photos */}
          <div className="flex justify-start gap-3 md:hidden">
            <img
              src="/girls.jpeg"
              alt="Students in student housing"
              className="h-36 w-36 rounded-2xl object-cover shadow-lg"
            />
            <img
              src="/us.jpeg"
              alt="Students reviewing housing"
              className="h-36 w-36 rounded-2xl object-cover shadow-lg"
            />
          </div>

          {/* Mobile search */}
          <div className="relative w-full min-w-0 pb-1 md:hidden">
            <div className="rounded-full shadow-lg">
              <div className="flex min-h-[3rem] w-full min-w-0 items-center rounded-full bg-white ring-1 ring-black/5">
                {isLoaded ? (
                  <Autocomplete
                    className="min-w-0 flex-1 [&_input]:w-full"
                    onLoad={(ac) => {
                      mobileAutocompleteRef.current = ac
                    }}
                    onPlaceChanged={() => applySelectedPlace(mobileAutocompleteRef)}
                    options={GUELPH_ADDRESS_OPTIONS}
                  >
                    {mobileInput}
                  </Autocomplete>
                ) : (
                  <div className="min-w-0 flex-1">{mobileInput}</div>
                )}
                <button
                  type="button"
                  aria-label="Search addresses"
                  disabled={searchDisabled}
                  className="m-1 shrink-0 rounded-full bg-gray-900 p-3 text-white transition-all hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50"
                  onClick={handleSearch}
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
            {searchError}
          </div>
        </div>
      </header>

      {/* What is Student Sphere — illustration cards (replaces old WhyUs text) */}
      <section className="relative z-10 bg-gradient-to-b from-sky-50/70 via-white to-white px-6 py-14 md:px-8 md:py-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-72 max-w-3xl -translate-y-1/2 rounded-full bg-sky-200/40 blur-3xl"
          aria-hidden
        />

        <div className="md:container md:mx-auto">
          <h3 className="mb-10 text-center text-2xl font-bold text-amber-900 md:mb-14 md:text-4xl">
            What is The Student Sphere?
          </h3>

          <div className="mx-auto grid max-w-5xl grid-cols-1 place-items-center gap-12 sm:grid-cols-3 sm:gap-8 md:gap-10">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`relative flex h-52 w-full max-w-[260px] items-center justify-center rounded-[2rem] sm:h-56 md:h-60 ${feature.blob}`}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={260}
                    height={260}
                    className="h-[88%] w-auto object-contain mix-blend-multiply"
                  />
                </div>
                <h4 className="mt-5 text-lg font-bold leading-snug text-gray-900 md:mt-6 md:text-xl">
                  {feature.title}
                </h4>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
