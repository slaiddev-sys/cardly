-- Cardly Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms (connections between two users)
CREATE TABLE public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Room members (who's in each room)
CREATE TABLE public.room_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Drawings/Messages
CREATE TABLE public.drawings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id),
    image_data TEXT NOT NULL, -- Base64 encoded image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Users can view rooms they're in"
    ON public.rooms FOR SELECT
    USING (
        id IN (
            SELECT room_id FROM public.room_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create rooms"
    ON public.rooms FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Room members policies
CREATE POLICY "Users can view room members of their rooms"
    ON public.room_members FOR SELECT
    USING (
        room_id IN (
            SELECT room_id FROM public.room_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join rooms"
    ON public.room_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Drawings policies
CREATE POLICY "Users can view drawings in their rooms"
    ON public.drawings FOR SELECT
    USING (
        room_id IN (
            SELECT room_id FROM public.room_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create drawings in their rooms"
    ON public.drawings FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        room_id IN (
            SELECT room_id FROM public.room_members
            WHERE user_id = auth.uid()
        )
    );

-- Functions

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_rooms_room_code ON public.rooms(room_code);
CREATE INDEX idx_room_members_room_id ON public.room_members(room_id);
CREATE INDEX idx_room_members_user_id ON public.room_members(user_id);
CREATE INDEX idx_drawings_room_id ON public.drawings(room_id);
CREATE INDEX idx_drawings_created_at ON public.drawings(created_at DESC);
