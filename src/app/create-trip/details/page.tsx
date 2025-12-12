'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TripDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tripName: '',
    overview: '',
    aboutYou: '',
    accommodation: '',
    accommodationType: '',
    accommodationDetails: '',
    inclusions: [] as string[],
    exclusions: [] as string[],
    specialFeatures: [] as string[],
  });

  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newSpecial, setNewSpecial] = useState('');

  const accommodationTypes = [
    'Hotel', 'Hostel', 'Apartments', 'Bed & Breakfast', 'Camping', 'Other'
  ];

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()]
      }));
      setNewInclusion('');
    }
  };

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()]
      }));
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  const addSpecial = () => {
    if (newSpecial.trim()) {
      setFormData(prev => ({
        ...prev,
        specialFeatures: [...prev.specialFeatures, newSpecial.trim()]
      }));
      setNewSpecial('');
    }
  };

  const removeSpecial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    console.log('Trip Details:', formData);
    router.push('/create-trip/itinerary');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">ROAMING</span>{' '}
              <span className="text-teal-600">CLAN</span>
            </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                JOIN A TRIP
              </Link>
              <a href="/create-trip" className="text-gray-700 hover:text-gray-900 font-medium">
                LEAD A TRIP
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                HOW IT WORKS
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">EN</span>
                <span className="text-sm text-gray-600">€ EUR</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Inspire others to join your trip
          </h2>

          {/* Trip Name */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">TRIP NAME</h3>
            <input
              type="text"
              value={formData.tripName}
              onChange={(e) => setFormData(prev => ({ ...prev, tripName: e.target.value }))}
              placeholder="e.g. Travel like a local through Thailand."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Trip Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">TRIP DESCRIPTION</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your trip information is divided into different parts to make it easier...
            </p>
            
            {/* Overview */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">OVERVIEW</h4>
              <textarea
                value={formData.overview}
                onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                placeholder="Write an overview of the trip giving a unique selling point..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-32 resize-y"
              />
            </div>

            {/* About You */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">ABOUT YOU</h4>
              <textarea
                value={formData.aboutYou}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutYou: e.target.value }))}
                placeholder="Introduce yourself and your expectations of the trip..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-32 resize-y"
              />
            </div>
          </div>

          {/* Accommodation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ACCOMMODATION</h3>
            <p className="text-sm text-gray-600 mb-4">Select the Type of Accommodation.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {accommodationTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="accommodation"
                    value={type}
                    checked={formData.accommodationType === type}
                    onChange={(e) => setFormData(prev => ({ ...prev, accommodationType: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            <textarea
              value={formData.accommodationDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, accommodationDetails: e.target.value }))}
              placeholder="Add more information about the accommodation such as the type of accommodation (hotel, hostel, apartment) and if your TripMates will have a private or shared room."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-24 resize-y"
            />
          </div>

          {/* Inclusions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">INCLUSIONS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Write a short list of what your trip will include. e.g.: Transportation between stops, entrance fees.
            </p>
            
            <div className="space-y-2 mb-4">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{inclusion}</span>
                  </div>
                  <button
                    onClick={() => removeInclusion(index)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Press + to add more."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && addInclusion()}
              />
              <button
                onClick={addInclusion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Exclusions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">EXCLUSIONS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Write a short list of what your trip will not include. e.g.: International Flights.
            </p>
            
            <div className="space-y-2 mb-4">
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center justify-between bg-teal-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-teal-600 mr-2">✕</span>
                    <span className="text-gray-700">{exclusion}</span>
                  </div>
                  <button
                    onClick={() => removeExclusion(index)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="Press + to add more."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
              />
              <button
                onClick={addExclusion}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* What's Special */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WHAT&apos;S SPECIAL?</h3>
            <p className="text-sm text-gray-600 mb-4">
              What&apos;s unique and special about your trip? List them down.
            </p>
            
            <div className="space-y-2 mb-4">
              {formData.specialFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2">💎</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                  <button
                    onClick={() => removeSpecial(index)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecial}
                onChange={(e) => setNewSpecial(e.target.value)}
                placeholder="Press + to add more."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && addSpecial()}
              />
              <button
                onClick={addSpecial}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
