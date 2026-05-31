// DM-PARK — National Park entity types (ThaiPark DB Design / SPEC-06 extension)

export type ParkStatus = 'active' | 'inactive';

export type ParkPlaceCategory =
  | 'camping'
  | 'waterfall'
  | 'cave'
  | 'viewpoint'
  | 'trail'
  | 'forest'
  | 'lake'
  | 'other';

export type ParkVerificationType = 'gps' | 'qr' | 'manual';

// DM-REGION
export type Region = {
  id: string;
  nameTh: string;
  nameEn: string;
  createdAt: string;
};

// DM-PROVINCE
export type Province = {
  id: string;
  regionId: string;
  provinceNameTh: string;
  provinceNameEn: string;
  latitude: number;
  longitude: number;
};

// DM-NATIONAL-PARK
export type NationalPark = {
  id: string;
  parkCode: string;
  nameTh: string;
  nameEn: string;
  description: string;
  provinceId: string;
  regionId: string;
  coverImage: string | null;
  latitude: number;
  longitude: number;
  mapUrl: string | null;
  status: ParkStatus;
  totalReviews: number;
  avgRating: number;
  createdAt: string;
};

// DM-PARK-IMAGE
export type ParkImageType = 'cover' | 'gallery';

export type ParkImage = {
  id: string;
  parkId: string;
  imageUrl: string;
  imageType: ParkImageType;
  sortOrder: number;
};

// DM-PARK-PLACE
export type ParkPlace = {
  id: string;
  parkId: string;
  placeName: string;
  description: string;
  category: ParkPlaceCategory;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  status: 'open' | 'closed' | 'seasonal';
};

// DM-PARK-FEE
export type ParkFeeNationality = 'thai' | 'foreign';
export type ParkFeeAgeGroup = 'adult' | 'child';

export type ParkFee = {
  id: string;
  parkId: string;
  nationalityType: ParkFeeNationality;
  ageGroup: ParkFeeAgeGroup;
  price: number;
};

// DM-PARK-REVIEW
export type ParkReview = {
  id: string;
  userId: string;
  parkId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

// DM-PARK-CHECKIN
export type ParkCheckin = {
  id: string;
  userId: string;
  parkId: string;
  latitude: number;
  longitude: number;
  checkinTime: string;
  verificationType: ParkVerificationType;
  deviceId: string | null;
};

// DM-USER-FAVORITE
export type UserFavorite = {
  id: string;
  userId: string;
  parkId: string;
};

// DM-WEATHER-CACHE
export type WeatherCache = {
  id: string;
  parkId: string;
  temperature: number;
  weatherMain: string;
  weatherDescription: string;
  icon: string;
  updatedAt: string;
};

// DM-AIR-QUALITY
export type AirQuality = {
  id: string;
  parkId: string;
  pm25: number;
  aqiLevel: string;
  description: string;
  updatedAt: string;
};
