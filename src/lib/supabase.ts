import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Trip {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  trip_name: string
  departure_date: string
  categories: string[]
  overview: string
  about_you: string
  accommodation_type: string
  accommodation_details: string
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
}

export interface TripStop {
  id: string
  trip_id: string
  stop_number: number
  location: string
  nights: number
  description: string
  activities: string
  created_at: string
}

export interface CostItem {
  id: string
  trip_id: string
  category: 'accommodation' | 'transportation' | 'activities'
  name: string
  amount: number
  created_at: string
}
