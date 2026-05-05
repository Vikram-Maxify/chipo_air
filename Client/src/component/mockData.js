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

// mockData.js
export const popularDestinations = [
  {
    name: "New Delhi",
    country: "India",
    code: "DEL",
    popular: true,
    category: "Heritage"
  },
  {
    name: "Mumbai",
    country: "India",
    code: "BOM",
    popular: true,
    category: "City"
  },
  {
    name: "Goa",
    country: "India",
    code: "GOI",
    popular: true,
    category: "Beach"
  },
  {
    name: "Dubai",
    country: "UAE",
    code: "DXB",
    popular: true,
    category: "City"
  },
  {
    name: "Singapore",
    country: "Singapore",
    code: "SIN",
    popular: true,
    category: "City"
  },
  {
    name: "Bangkok",
    country: "Thailand",
    code: "BKK",
    popular: false,
    category: "City"
  },
  {
    name: "London",
    country: "UK",
    code: "LHR",
    popular: true,
    category: "Heritage"
  },
  {
    name: "Paris",
    country: "France",
    code: "CDG",
    popular: true,
    category: "Heritage"
  },
  {
    name: "Maldives",
    country: "Maldives",
    code: "MLE",
    popular: false,
    category: "Island"
  },
  {
    name: "Bali",
    country: "Indonesia",
    code: "DPS",
    popular: true,
    category: "Island"
  },
  // Add more destinations as needed
];