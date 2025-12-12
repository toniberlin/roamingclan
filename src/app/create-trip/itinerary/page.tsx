'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TripStop {
  id: number;
  location: string;
  nights: number;
  description: string;
  activities: string;
}

export default function TripItinerary() {
  const router = useRouter();
  const [stops, setStops] = useState<TripStop[]>([
    {
      id: 1,
      location: '',
      nights: 0,
      description: '',
      activities: ''
    }
  ]);

  const addStop = () => {
    const newStop: TripStop = {
      id: stops.length + 1,
      location: '',
      nights: 0,
      description: '',
      activities: ''
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: number) => {
    if (stops.length > 1) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const updateStop = (id: number, field: keyof TripStop, value: string | number) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const handleNext = () => {
    console.log('Trip Itinerary:', stops);
    router.push('/create-trip/cost');
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
              <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                JOIN A TRIP
              </a>
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
      <main className="flex h-screen">
        {/* Left Panel - Map */}
        <div className="flex-1 bg-gray-100 relative">
          {/* Map Placeholder */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
              <p className="text-gray-500">Your trip stops will appear here</p>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white rounded-lg shadow-lg p-2">
              <div className="text-xs text-gray-500">Google</div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-4 right-4">
            <button className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Panel - Trip Stops */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Trip Stop Summary */}
            <div className="mb-6">
              <div className="bg-teal-100 border border-teal-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <button className="text-teal-600 hover:text-teal-800 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <span className="text-teal-700 font-medium">
                    {stops[0]?.location || 'UNKNOWN'} DAY {stops.length}
                  </span>
                </div>
                <button className="text-teal-600 hover:text-teal-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your changes will be saved automatically.
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Add images for stop here
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Make sure to upload relevant, high quality images.
              </p>
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600 font-medium">ADD</span>
                </div>
              </button>
            </div>

            {/* Trip Stops */}
            {stops.map((stop, index) => (
              <div key={stop.id} className="mb-6 border border-gray-200 rounded-lg p-4">
                {/* Stop Header */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Stop {index + 1}</h4>
                  {stops.length > 1 && (
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="ml-auto text-teal-600 hover:text-teal-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={stop.location}
                    onChange={(e) => updateStop(stop.id, 'location', e.target.value)}
                    placeholder="Enter a location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Nights Counter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nights</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateStop(stop.id, 'nights', Math.max(0, stop.nights - 1))}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{stop.nights}</span>
                    <button
                      onClick={() => updateStop(stop.id, 'nights', stop.nights + 1)}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more</label>
                  <textarea
                    value={stop.description}
                    onChange={(e) => updateStop(stop.id, 'description', e.target.value)}
                    placeholder="Describe this stop..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-20 resize-y"
                  />
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What do you do / visit in this place
                  </label>
                  <textarea
                    value={stop.activities}
                    onChange={(e) => updateStop(stop.id, 'activities', e.target.value)}
                    placeholder="List activities and places to visit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-20 resize-y"
                  />
                </div>
              </div>
            ))}

            {/* Add Stop Button */}
            <button
              onClick={addStop}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-gray-600 font-medium">ADD A STOP</span>
              </div>
            </button>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
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
        </div>
      </main>
    </div>
  );
}
