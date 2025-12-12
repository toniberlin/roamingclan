'use client';

import { useState, useEffect } from 'react';
import { TripService } from '@/lib/trip-service';
import TripCard from '@/components/TripCard';
import { supabase } from '@/lib/supabase';

interface TripWithHost {
  trip: any;
  host: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export default function TripsPage() {
  const [trips, setTrips] = useState<TripWithHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Fetch published trips
        const { trips: publishedTrips, error: tripsError } = await TripService.getPublishedTrips();
        
        if (tripsError) {
          setError(tripsError);
          return;
        }

        // Fetch host information for each trip
        const tripsWithHosts = await Promise.all(
          publishedTrips.map(async (trip) => {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', trip.user_id)
              .single();

            return {
              trip,
              host: profile || { id: trip.user_id, full_name: 'Unknown Host' }
            };
          })
        );

        setTrips(tripsWithHosts);
      } catch (err) {
        setError('Failed to fetch trips');
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing trips...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
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
              <a href="/trips" className="text-teal-600 hover:text-teal-800 font-medium">
                BROWSE TRIPS
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Trips</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing adventures led by passionate travelers. Join unique trips and create unforgettable memories.
          </p>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips available yet</h3>
            <p className="text-gray-600 mb-6">Be the first to create an amazing trip!</p>
            <a href="/create-trip" className="btn-primary">
              Create Your First Trip
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((tripWithHost) => (
              <TripCard
                key={tripWithHost.trip.id}
                trip={tripWithHost.trip}
                host={tripWithHost.host}
                confirmed={Math.random() > 0.3} // Random confirmed status for demo
                spotsLeft={Math.floor(Math.random() * 3) + 1} // Random spots left
                photoCount={Math.floor(Math.random() * 20) + 5} // Random photo count
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {trips.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Lead Your Own Adventure?</h3>
              <p className="text-gray-600 mb-6">
                Share your passion for travel and create unforgettable experiences for fellow adventurers.
              </p>
              <a href="/create-trip" className="btn-primary">
                Create a Trip
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
