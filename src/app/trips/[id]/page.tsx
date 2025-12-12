'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TripService, Trip, TripStopRecord, CostItemRecord } from '@/lib/trip-service';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
}

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [host, setHost] = useState<Profile | null>(null);
  const [tripStops, setTripStops] = useState<TripStopRecord[]>([]);
  const [costItems, setCostItems] = useState<CostItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        // Fetch trip details
        const { trip: tripData, error: tripError } = await TripService.getTrip(tripId);
        
        if (tripError) {
          setError(tripError);
          return;
        }

        if (!tripData) {
          setError('Trip not found');
          return;
        }

        setTrip(tripData);

        // Fetch host information
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', tripData.user_id)
          .single();

        if (!profileError) {
          setHost(profile);
        }

        // Fetch trip stops
        const { data: stops, error: stopsError } = await supabase
          .from('trip_stops')
          .select('*')
          .eq('trip_id', tripId)
          .order('stop_number');

        if (!stopsError) {
          setTripStops(stops || []);
        }

        // Fetch cost items
        const { data: costs, error: costsError } = await supabase
          .from('cost_items')
          .select('*')
          .eq('trip_id', tripId);

        if (!costsError) {
          setCostItems(costs || []);
        }

      } catch (err) {
        setError('Failed to fetch trip details');
        console.error('Error fetching trip details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This trip does not exist or has been removed.'}</p>
          <Link href="/trips" className="btn-primary">
            Browse All Trips
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-blue-600">ROAMING</span>{' '}
                <span className="text-teal-600">CLAN</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/trips" className="text-gray-700 hover:text-gray-900 font-medium">
                BROWSE TRIPS
              </Link>
              <a href="/create-trip" className="text-gray-700 hover:text-gray-900 font-medium">
                LEAD A TRIP
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.trip_name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <Link 
                  href={`/profile/${host?.id}`}
                  className="hover:text-teal-600 transition-colors"
                >
                  with {host?.full_name || 'Unknown Host'}
                </Link>
                <span>•</span>
                <span>{formatDate(trip.departure_date)}</span>
                <span>•</span>
                <span>{tripStops.length} stops</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {trip.currency} {trip.total_cost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {trip.categories.map((category: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>

          {/* Overview */}
          {trip.overview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
              <p className="text-gray-600">{trip.overview}</p>
            </div>
          )}

          {/* Group Size */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Group size: {trip.min_trip_mates}-{trip.max_trip_mates} people</span>
            <span>Status: <span className="text-green-600 font-medium">Published</span></span>
          </div>
        </div>

        {/* Itinerary */}
        {tripStops.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
            <div className="space-y-6">
              {tripStops.map((stop) => (
                <div key={stop.id} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {stop.stop_number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{stop.location}</h3>
                    <p className="text-sm text-gray-600 mb-2">{stop.nights} nights</p>
                    {stop.description && (
                      <p className="text-gray-600 mb-2">{stop.description}</p>
                    )}
                    {stop.activities && (
                      <p className="text-sm text-gray-500">{stop.activities}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        {costItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h2>
            <div className="space-y-3">
              {costItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 capitalize">{item.name}</span>
                  <span className="font-medium">{trip.currency} {item.amount.toLocaleString()}</span>
                </div>
              ))}
              {trip.your_fee > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Host Fee</span>
                  <span className="font-medium">{trip.currency} {trip.your_fee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 font-bold text-lg">
                <span>Total</span>
                <span>{trip.currency} {trip.total_cost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Host Information */}
        {host && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Your Host</h2>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {host.full_name?.charAt(0).toUpperCase() || 'H'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{host.full_name}</h3>
                {host.bio && (
                  <p className="text-gray-600 mt-2">{host.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Join Trip Button */}
        <div className="text-center">
          <button className="btn-primary text-lg px-8 py-4">
            Join This Trip
          </button>
        </div>
      </main>
    </div>
  );
}
