'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, Button, Badge } from '@/components/ui';
import { Trip, TripStopRecord, CostItemRecord } from '@/lib/trip-service';
import { supabase } from '@/lib/supabase';
import { getPlaceholderImage } from '@/lib/placeholder-images';

interface Profile {
  id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface TripWithDetails extends Trip {
  trip_stops: TripStopRecord[];
  cost_items: CostItemRecord[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<TripWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as Profile);

        // Fetch user's trips
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select(`
            *,
            trip_stops(*),
            cost_items(*)
          `)
          .eq('user_id', id)
          .eq('status', 'published')
          .order('departure_date', { ascending: true });

        if (tripsError) throw tripsError;
        setTrips((tripsData || []) as TripWithDetails[]);

      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The profile you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const upcomingTrips = trips.filter(trip => new Date(trip.departure_date) > new Date());
  const pastTrips = trips.filter(trip => new Date(trip.departure_date) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Teal Banner */}
      <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={profile.avatar_url || getPlaceholderImage(profile.full_name || 'Profile')}
                  alt={profile.full_name || 'Profile'}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verification Badge */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.full_name || 'Trip Leader'}
              </h1>
              
              {/* Bio */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {profile.bio || "Hello there! 👋 I'm a passionate traveler who loves sharing amazing experiences with fellow adventurers. Can't wait to explore the world with you! 🌍"}
              </p>

              {/* Verification Badges */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge type="success" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Identity verified</span>
                </Badge>
                
                <Badge type="success" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Phone verified</span>
                </Badge>
                
                <Badge type="primary" className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ProLeader</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">5.0</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {profile.full_name} is most often complimented for...
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge type="warning" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Communication</span>
            </Badge>
            
            <Badge type="primary" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Informed</span>
            </Badge>
            
            <Badge type="success" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
              <span>Friendliness</span>
            </Badge>
          </div>

          {/* Sample Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={getPlaceholderImage('Reviewer')}
                  alt="Reviewer"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                <p className="text-sm text-gray-600">&apos;Amazing Adventure in Japan&apos;, Dec 2023</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-sm font-medium">5/5</span>
            </div>
            <p className="text-gray-700">
              &quot;I had an incredible time traveling with {profile.full_name}. They were well-informed, 
              made sure I felt comfortable and safe during the trip, and showed me amazing places 
              I never would have found on my own. I can definitely recommend traveling with them!&quot;
            </p>
          </div>
        </div>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.slice(0, 3).map((trip) => (
                <div key={trip.id} className="group cursor-pointer">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={getPlaceholderImage(trip.trip_name)}
                      alt={trip.trip_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge type="secondary" className="bg-black/70 text-white">
                        • {trip.categories[0] || 'Adventure'}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge type="secondary" className="bg-black/70 text-white flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span>12</span>
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={profile.avatar_url || getPlaceholderImage(profile.full_name || 'Profile')}
                          alt={profile.full_name || 'Host'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-900">5</span>
                    <span className="text-gray-600">with {profile.full_name}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {trip.trip_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(trip.departure_date).toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: '2-digit' 
                    })} • {trip.trip_stops.length} Days
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTrips.slice(0, 6).map((trip) => (
                <div key={trip.id} className="group cursor-pointer">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={getPlaceholderImage(trip.trip_name)}
                      alt={trip.trip_name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge type="secondary" className="bg-black/70 text-white">
                        • {trip.categories[0] || 'Adventure'}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge type="secondary" className="bg-black/70 text-white flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span>8</span>
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={profile.avatar_url || getPlaceholderImage(profile.full_name || 'Profile')}
                          alt={profile.full_name || 'Host'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-900">5</span>
                    <span className="text-gray-600">with {profile.full_name}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {trip.trip_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(trip.departure_date).toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: '2-digit' 
                    })} • {trip.trip_stops.length} Days
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
