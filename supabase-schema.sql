-- Roaming Clan Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE public.trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_name TEXT NOT NULL,
  departure_date DATE NOT NULL,
  categories TEXT[] DEFAULT '{}',
  overview TEXT,
  about_you TEXT,
  accommodation_type TEXT,
  accommodation_details TEXT,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  special_features TEXT[] DEFAULT '{}',
  min_trip_mates INTEGER DEFAULT 1,
  max_trip_mates INTEGER DEFAULT 10,
  currency TEXT DEFAULT 'EUR',
  buffer_percentage INTEGER DEFAULT 0,
  your_fee DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip stops table
CREATE TABLE public.trip_stops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  stop_number INTEGER NOT NULL,
  location TEXT NOT NULL,
  nights INTEGER DEFAULT 0,
  description TEXT,
  activities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cost items table
CREATE TABLE public.cost_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'transportation', 'activities')),
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip bookings table (for when users join trips)
CREATE TABLE public.trip_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_departure_date ON public.trips(departure_date);
CREATE INDEX idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX idx_cost_items_trip_id ON public.cost_items(trip_id);
CREATE INDEX idx_trip_bookings_trip_id ON public.trip_bookings(trip_id);
CREATE INDEX idx_trip_bookings_user_id ON public.trip_bookings(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view published trips" ON public.trips FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "Users can create trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Trip stops policies
CREATE POLICY "Users can view stops for accessible trips" ON public.trip_stops FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = trip_stops.trip_id 
    AND (trips.status = 'published' OR trips.user_id = auth.uid())
  )
);
CREATE POLICY "Users can manage stops for own trips" ON public.trip_stops FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = trip_stops.trip_id 
    AND trips.user_id = auth.uid()
  )
);

-- Cost items policies
CREATE POLICY "Users can view cost items for accessible trips" ON public.cost_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = cost_items.trip_id 
    AND (trips.status = 'published' OR trips.user_id = auth.uid())
  )
);
CREATE POLICY "Users can manage cost items for own trips" ON public.cost_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = cost_items.trip_id 
    AND trips.user_id = auth.uid()
  )
);

-- Trip bookings policies
CREATE POLICY "Users can view own bookings" ON public.trip_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trip creators can view bookings for their trips" ON public.trip_bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = trip_bookings.trip_id 
    AND trips.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create bookings" ON public.trip_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.trip_bookings FOR UPDATE USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trip_bookings_updated_at BEFORE UPDATE ON public.trip_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
