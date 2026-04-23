// src/data/mockData.js

export const cities = [
  { code: "DEL", name: "Delhi", country: "India" },
  { code: "BOM", name: "Mumbai", country: "India" },
  { code: "BLR", name: "Bangalore", country: "India" },
  { code: "HYD", name: "Hyderabad", country: "India" },
  { code: "CCU", name: "Kolkata", country: "India" },
  { code: "MAA", name: "Chennai", country: "India" },
  { code: "GOI", name: "Goa", country: "India" },
  { code: "PNQ", name: "Pune", country: "India" },
];

export const passengersList = [1, 2, 3, 4, 5, 6];

export const travelClasses = [
  "Economy",
  "Premium Economy",
  "Business",
  "First Class",
];

export const tripTypes = [
  { id: "roundtrip", label: "Round Trip" },
  { id: "oneway", label: "One Way" },
  { id: "multicity", label: "Multi City" },
];

// src/data/mockData.js

export const mockPackages = [
  {
    id: "1",
    title: "Goa Beach Escape",
    destination: "Goa, India",
    duration: "4 Days / 3 Nights",
    price: 15000,
    rating: 4.5,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: "2",
    title: "Kerala Backwaters",
    destination: "Kerala, India",
    duration: "5 Days / 4 Nights",
    price: 18000,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944"
  },
  {
    id: "3",
    title: "Dubai Luxury Trip",
    destination: "Dubai, UAE",
    duration: "5 Days / 4 Nights",
    price: 55000,
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
  },
  {
    id: "4",
    title: "Thailand Getaway",
    destination: "Phuket, Thailand",
    duration: "6 Days / 5 Nights",
    price: 45000,
    rating: 4.6,
    reviews: 150,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  }
];

// src/data/mockData.js

export const popularDestinations = [
  { name: "Mumbai", code: "BOM", country: "India", image: "https://images.unsplash.com/photo-1529257414771-1960c7f0b2f4" },
  { name: "Delhi", code: "DEL", country: "India", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
  { name: "Bangalore", code: "BLR", country: "India", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2" },
  { name: "Goa", code: "GOI", country: "India", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { name: "Jaipur", code: "JAI", country: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },

  { name: "Dubai", code: "DXB", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
  { name: "Singapore", code: "SIN", country: "Singapore", image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac" },
  { name: "Bangkok", code: "BKK", country: "Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365" },
  { name: "Paris", code: "CDG", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
  { name: "New York", code: "JFK", country: "USA", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59" },
];