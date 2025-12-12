'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTrip() {
  const router = useRouter();
  const [departureDate, setDepartureDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'food', name: 'Food', icon: '🍜' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'culture', name: 'Culture', icon: '🏛️' },
    { id: 'party', name: 'Party', icon: '🍺' },
    { id: 'sport', name: 'Sport', icon: '⚽' },
    { id: 'nature', name: 'Nature', icon: '🌲' },
    { id: 'city', name: 'City', icon: '🏙️' },
    { id: 'backpacking', name: 'Backpacking', icon: '🎒' },
    { id: 'female-only', name: 'Female Only', icon: '👩' },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    router.push('/create-trip/details');
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
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hi! Let&apos;s get started!
            </h2>
            <p className="text-gray-600">
              Create your trip and inspire others to join your adventure.
            </p>
          </div>

          {/* Departure Date Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Departure date
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              (End date is automatically calculated based on stops)
            </p>
            
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                placeholder="From"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Trips can only be planned two months in advance to maximise your bookings
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 mb-8" />

          {/* Categories Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pick categories
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
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
