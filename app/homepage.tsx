'use client'

import React, { useState } from 'react';
import { Home, Users, Search, MapPin, Star, Check } from 'lucide-react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Properties from './Components/Properties';
import WhyUs from './Components/WhyUs';
import Footer from './Components/Footer';

const HomePage = () => {

  return (
    <div className="min-h-screen relative font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{
          backgroundImage: 'url("/api/placeholder/1920/1080")',
          filter: 'brightness(50%) contrast(120%)'
        }}
      />

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <Hero/>

      {/* Why Choose Us */}
      <WhyUs/>

      {/* Featured Properties */}
      <Properties/>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;