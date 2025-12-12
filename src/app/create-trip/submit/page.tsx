'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripService } from '@/lib/trip-service';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SubmitTrip() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripPublished, setTripPublished] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Use the authenticated user's ID
      if (!user) {
        alert('Please sign in to create a trip');
        setIsSubmitting(false);
        return;
      }
      
      // Mock trip data - in a real app, this would come from the previous steps
      const tripData = {
        tripName: 'Epic European Adventure',
        departureDate: '2025-09-17',
        categories: ['Wellness', 'Party'],
        overview: 'Join us for an amazing journey through Europe\'s most beautiful cities...',
        aboutYou: 'I\'m a passionate traveler who loves to explore new cultures...',
        accommodationType: 'Hotel',
        accommodationDetails: 'Comfortable hotels with private rooms',
        inclusions: ['Accommodation', 'Local transport', 'Entrance fees'],
        exclusions: ['International flights', 'Personal expenses'],
        specialFeatures: ['Local guides', 'Cultural experiences'],
        minTripMates: 2,
        maxTripMates: 4,
        currency: 'EUR',
        buffer: 10,
        yourFee: 50,
        stops: [
          {
            location: 'Paris, France',
            nights: 3,
            description: 'Explore the City of Light',
            activities: 'Visit Eiffel Tower, Louvre Museum, Seine River cruise'
          },
          {
            location: 'Amsterdam, Netherlands',
            nights: 2,
            description: 'Discover Dutch culture',
            activities: 'Canal tour, Anne Frank House, Van Gogh Museum'
          }
        ],
        costItems: [
          { category: 'accommodation' as const, name: 'Hotels', amount: 800 },
          { category: 'transportation' as const, name: 'Local transport', amount: 300 },
          { category: 'activities' as const, name: 'Tours and activities', amount: 100 }
        ]
      };

      const { trip, error } = await TripService.createTrip(tripData, user.id);
      
      if (error) {
        console.error('Error creating trip:', error);
        alert('Failed to create trip. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Trip created successfully:', trip);
      setIsSubmitting(false);
      setTripPublished(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleViewTrip = () => {
    // TODO: Navigate to the published trip page
    console.log('Viewing published trip...');
  };

  const handleCreateAnother = () => {
    router.push('/create-trip');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to create a trip.</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (tripPublished) {
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
            </div>
          </div>
        </header>

        {/* Success Page */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trip Published Successfully!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Your trip is now live and ready for travelers to discover and join.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleViewTrip}
                className="w-full btn-primary text-lg py-4 px-8 shadow-gradient"
              >
                View Your Trip
              </button>
              
              <button
                onClick={handleCreateAnother}
                className="w-full btn-secondary text-lg py-4 px-8"
              >
                Create Another Trip
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            Review & Publish Your Trip
          </h2>

          {/* Trip Summary */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trip Name</label>
                  <p className="text-gray-900">Epic European Adventure</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                  <p className="text-gray-900">September 17, 2025</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categories</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Wellness</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Party</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Group Size</label>
                  <p className="text-gray-900">2-4 TripMates</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                  <p className="text-gray-600">Join us for an amazing journey through Europe&apos;s most beautiful cities...</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                  <p className="text-gray-600">I&apos;m a passionate traveler who loves to explore new cultures...</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Paris, France</p>
                    <p className="text-sm text-gray-600">3 nights</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Amsterdam, Netherlands</p>
                    <p className="text-sm text-gray-600">2 nights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="card-gradient shadow-gradient">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Cost per TripMate</span>
                  <span className="text-3xl font-bold">€ 1,250</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Accommodation:</span>
                  <span className="ml-2 font-medium">€ 800</span>
                </div>
                <div>
                  <span className="text-gray-600">Transportation:</span>
                  <span className="ml-2 font-medium">€ 300</span>
                </div>
                <div>
                  <span className="text-gray-600">Activities:</span>
                  <span className="ml-2 font-medium">€ 100</span>
                </div>
                <div>
                  <span className="text-gray-600">Your Fee:</span>
                  <span className="ml-2 font-medium">€ 50</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
              <div className="space-y-3">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-teal-600 hover:text-teal-800">Terms of Service</a> and <a href="#" className="text-teal-600 hover:text-teal-800">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span className="text-sm text-gray-600">
                    I confirm that all trip information is accurate and I am responsible for the trip
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span className="text-sm text-gray-600">
                    I understand that I will be charged a 5% platform fee on successful bookings
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </div>
              ) : (
                'Publish Trip'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
