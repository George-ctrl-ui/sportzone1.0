export interface Sport {
  id: string;
  name: string;
  category: string;
  description: string;
  court: string;
  minRate: number;
  maxRate: number;
  image: string;
  imageAlt: string;
}
export interface BookingRequest {
  name: string;
  phone: string;
  email: string;
  sport: string;
  date: string;
  time: string;
  duration: number;
  message: string;
  website: string;
}
