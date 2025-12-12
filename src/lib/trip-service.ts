import { supabase } from './supabase'

export interface TripStop {
  location: string
  nights: number
  description?: string
  activities?: string
}

export interface CostItem {
  category: 'accommodation' | 'transportation' | 'activities'
  name: string
  amount: number
}

export interface TripData {
  tripName: string
  departureDate: string
  categories: string[]
  overview?: string
  aboutYou?: string
  accommodationType?: string
  accommodationDetails?: string
  inclusions: string[]
  exclusions: string[]
  specialFeatures: string[]
  minTripMates: number
  maxTripMates: number
  currency: string
  buffer: number
  yourFee: number
  stops: TripStop[]
  costItems: CostItem[]
}

export interface Trip {
  id: string
  user_id: string
  trip_name: string
  departure_date: string
  categories: string[]
  overview?: string
  about_you?: string
  accommodation_type?: string
  accommodation_details?: string
  inclusions: string[]
  exclusions: string[]
  special_features: string[]
  min_trip_mates: number
  max_trip_mates: number
  currency: string
  buffer_percentage: number
  your_fee: number
  total_cost: number
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface TripStopRecord {
  id: string
  trip_id: string
  stop_number: number
  location: string
  nights: number
  description?: string
  activities?: string
  created_at: string
}

export interface CostItemRecord {
  id: string
  trip_id: string
  category: 'accommodation' | 'transportation' | 'activities'
  name: string
  amount: number
  created_at: string
}

export class TripService {
  static async createTrip(tripData: TripData, userId: string): Promise<{ trip: Trip | null; error: string | null }> {
    try {
      // Calculate total cost
      const totalCost = tripData.costItems.reduce((sum, item) => sum + item.amount, 0)
      const costWithBuffer = totalCost * (1 + tripData.buffer / 100)
      const finalCost = costWithBuffer + tripData.yourFee

      // Create the trip record
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: userId,
          trip_name: tripData.tripName,
          departure_date: tripData.departureDate,
          categories: tripData.categories,
          overview: tripData.overview,
          about_you: tripData.aboutYou,
          accommodation_type: tripData.accommodationType,
          accommodation_details: tripData.accommodationDetails,
          inclusions: tripData.inclusions,
          exclusions: tripData.exclusions,
          special_features: tripData.specialFeatures,
          min_trip_mates: tripData.minTripMates,
          max_trip_mates: tripData.maxTripMates,
          currency: tripData.currency,
          buffer_percentage: tripData.buffer,
          your_fee: tripData.yourFee,
          total_cost: finalCost,
          status: 'published'
        })
        .select()
        .single()

      if (tripError) {
        console.error('Error creating trip:', tripError)
        return { trip: null, error: tripError.message }
      }

      // Create trip stops
      if (tripData.stops && tripData.stops.length > 0) {
        const stopsData = tripData.stops.map((stop, index) => ({
          trip_id: trip.id,
          stop_number: index + 1,
          location: stop.location,
          nights: stop.nights,
          description: stop.description,
          activities: stop.activities
        }))

        const { error: stopsError } = await supabase
          .from('trip_stops')
          .insert(stopsData)

        if (stopsError) {
          console.error('Error creating trip stops:', stopsError)
          // Don't fail the entire operation, just log the error
        }
      }

      // Create cost items
      if (tripData.costItems && tripData.costItems.length > 0) {
        const costItemsData = tripData.costItems.map(item => ({
          trip_id: trip.id,
          category: item.category,
          name: item.name,
          amount: item.amount
        }))

        const { error: costItemsError } = await supabase
          .from('cost_items')
          .insert(costItemsData)

        if (costItemsError) {
          console.error('Error creating cost items:', costItemsError)
          // Don't fail the entire operation, just log the error
        }
      }

      return { trip, error: null }
    } catch (error) {
      console.error('Unexpected error creating trip:', error)
      return { trip: null, error: 'An unexpected error occurred' }
    }
  }

  static async getTrip(tripId: string): Promise<{ trip: Trip | null; error: string | null }> {
    try {
      const { data: trip, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (error) {
        return { trip: null, error: error.message }
      }

      return { trip, error: null }
    } catch (error) {
      console.error('Error fetching trip:', error)
      return { trip: null, error: 'An unexpected error occurred' }
    }
  }

  static async getUserTrips(userId: string): Promise<{ trips: Trip[]; error: string | null }> {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return { trips: [], error: error.message }
      }

      return { trips: trips || [], error: null }
    } catch (error) {
      console.error('Error fetching user trips:', error)
      return { trips: [], error: 'An unexpected error occurred' }
    }
  }

  static async getPublishedTrips(): Promise<{ trips: Trip[]; error: string | null }> {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        return { trips: [], error: error.message }
      }

      return { trips: trips || [], error: null }
    } catch (error) {
      console.error('Error fetching published trips:', error)
      return { trips: [], error: 'An unexpected error occurred' }
    }
  }

  static async updateTripStatus(tripId: string, status: 'draft' | 'published' | 'completed' | 'cancelled'): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status })
        .eq('id', tripId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error updating trip status:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}
