'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getPlaceholderImage, getCountryImage } from '@/lib/placeholder-images';

interface TripCardProps {
  trip: {
    id: string;
    trip_name: string;
    departure_date: string;
    total_cost: number;
    currency: string;
    min_trip_mates: number;
    max_trip_mates: number;
    categories: string[];
    overview?: string;
    user_id: string;
    created_at: string;
  };
  host: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  imageUrl?: string;
  rating?: number;
  confirmed?: boolean;
  spotsLeft?: number;
  photoCount?: number;
}

export default function TripCard({ 
  trip, 
  host, 
  imageUrl,
  rating = 5,
  confirmed = false,
  spotsLeft,
  photoCount = 12
}: TripCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const calculateDuration = () => {
    // For now, return a mock duration. In a real app, this would be calculated from trip stops
    return Math.floor(Math.random() * 10) + 3; // 3-12 days
  };

  const getCountryFromCategories = () => {
    // Extract country from categories or use a default
    const countryCategories = trip.categories.filter(cat => 
      ['Egypt', 'Turkey', 'Thailand', 'Indonesia', 'Georgia', 'Slovenia'].includes(cat)
    );
    return countryCategories[0] || 'Europe';
  };

  const country = getCountryFromCategories();
  const tripImage = imageUrl || getCountryImage(country);

  const availableSpots = trip.max_trip_mates - trip.min_trip_mates;
  const spotsRemaining = spotsLeft || Math.floor(Math.random() * availableSpots) + 1;

  return (
    <Link href={`/trips/${trip.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={tripImage}
            alt={trip.trip_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Country Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
              • {country}
            </span>
          </div>
          
          {/* Photo Count Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {photoCount}
            </span>
          </div>
          
          {/* Host Profile Picture */}
          <div className="absolute bottom-3 left-3">
            <Link 
              href={`/profile/${host.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200 hover:border-teal-400 transition-colors">
                {host.avatar_url ? (
                  <Image
                    src={host.avatar_url}
                    alt={host.full_name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                    {host.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Host Name and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Link 
                href={`/profile/${host.id}`}
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                with {host.full_name}
              </Link>
              <div className="flex items-center">
                <span className="text-green-500 text-sm">★</span>
                <span className="text-sm text-gray-600 ml-1">{rating}</span>
              </div>
            </div>
          </div>
          
          {/* Trip Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
            {trip.trip_name}
          </h3>
          
          {/* Date and Duration */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {formatDate(trip.departure_date)} • {calculateDuration()} Days
            </span>
            {confirmed && (
              <span className="flex items-center text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Confirmed
              </span>
            )}
          </div>
          
          {/* Price and Spots */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {trip.currency} {trip.total_cost.toLocaleString()}
            </span>
            {spotsRemaining <= 3 && (
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                ⚡ {spotsRemaining} SPOT{spotsRemaining > 1 ? 'S' : ''} LEFT
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
