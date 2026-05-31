import {
  nationalParks,
  parkFees,
  parkImages,
  parkPlaces,
  parkReviews,
  provinces,
  regions,
} from '@/data/parks';
import type {
  NationalPark,
  ParkFee,
  ParkImage,
  ParkPlace,
  ParkReview,
  Province,
  Region,
} from '@/types/park';


// Data-access facade for national parks (SPEC-06 extension)
// When NEXT_PUBLIC_SUPABASE_URL is set, queries Supabase; falls back to mock data.

export async function getRegions(): Promise<Region[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase.from('regions').select('*').order('name_en');
    if (data) return data as Region[];
  }
  return regions;
}

export async function getProvinces(regionId?: string): Promise<Province[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    let query = supabase.from('provinces').select('*').order('province_name_en');
    if (regionId) query = query.eq('region_id', regionId);
    const { data } = await query;
    if (data) return data as Province[];
  }
  if (regionId) return provinces.filter((p) => p.regionId === regionId);
  return provinces;
}

export async function getParks(filters?: {
  regionId?: string;
  status?: 'active' | 'inactive';
}): Promise<NationalPark[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    let query = supabase.from('national_parks').select('*').order('name_th');
    if (filters?.regionId) query = query.eq('region_id', filters.regionId);
    if (filters?.status)   query = query.eq('status', filters.status);
    const { data } = await query;
    if (data) return data as NationalPark[];
  }
  let results = [...nationalParks];
  if (filters?.regionId) results = results.filter((p) => p.regionId === filters.regionId);
  if (filters?.status)   results = results.filter((p) => p.status   === filters.status);
  return results;
}

export async function getParkById(id: string): Promise<NationalPark | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase.from('national_parks').select('*').eq('id', id).single();
    if (data) return data as NationalPark;
  }
  return nationalParks.find((p) => p.id === id) ?? null;
}

export async function getParkPlaces(parkId: string): Promise<ParkPlace[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('park_places')
      .select('*')
      .eq('park_id', parkId)
      .order('place_name');
    if (data) return data as ParkPlace[];
  }
  return parkPlaces.filter((pl) => pl.parkId === parkId);
}

export async function getParkFees(parkId: string): Promise<ParkFee[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase.from('park_fees').select('*').eq('park_id', parkId);
    if (data) return data as ParkFee[];
  }
  return parkFees.filter((f) => f.parkId === parkId);
}

export async function getParkImages(parkId: string): Promise<ParkImage[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('park_images')
      .select('*')
      .eq('park_id', parkId)
      .order('sort_order');
    if (data) return data as ParkImage[];
  }
  return parkImages.filter((img) => img.parkId === parkId).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getParkReviews(parkId: string): Promise<ParkReview[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('park_reviews')
      .select('*')
      .eq('park_id', parkId)
      .order('created_at', { ascending: false });
    if (data) return data as ParkReview[];
  }
  return parkReviews.filter((r) => r.parkId === parkId);
}
