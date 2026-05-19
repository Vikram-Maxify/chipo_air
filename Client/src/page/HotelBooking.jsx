import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, CalendarDays, Users, Star, SlidersHorizontal, ChevronDown, Wifi, Car, Coffee, Dumbbell, Waves, Heart, ArrowUpDown, X, FilterX, Wind, Utensils, Tv, Snowflake, Anchor } from "lucide-react";
import { DateRange } from "react-date-range";
import { addDays, differenceInDays, format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";

const HotelBooking = () => {
    const destinationRef = useRef(null);
    const mobileFilterRef = useRef(null);

    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuests, setShowGuests] = useState(false);
    const [showDestination, setShowDestination] = useState(false);
    const [isSelectingDate, setIsSelectingDate] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [destinationInput, setDestinationInput] = useState("");
    const [destination, setDestination] = useState("");
    const [selectedPrice, setSelectedPrice] = useState(300); // $300 (was ₹25000)
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
    const navigate = useNavigate();


    const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

    const [dateRange, setDateRange] = useState([
        { startDate: addDays(new Date(), 1), endDate: addDays(new Date(), 4), key: "selection" },
    ]);

    const destinations = [
        "New York", "Los Angeles", "Las Vegas", "Miami", "Orlando",
        "Chicago", "San Francisco", "Seattle", "Boston", "Washington DC",
        "Austin", "Denver", "Nashville", "New Orleans", "San Diego",
        "Honolulu", "Phoenix", "Portland", "Atlanta", "Dallas"
    ];

    // Enhanced Amenities for USA hotels
    const amenities = [
        { name: "Free WiFi", icon: Wifi },
        { name: "Free Parking", icon: Car },
        { name: "Free Breakfast", icon: Coffee },
        { name: "Fitness Center", icon: Dumbbell },
        { name: "Outdoor Pool", icon: Waves },
        { name: "Air Conditioning", icon: Wind },
        { name: "Restaurant", icon: Utensils },
        { name: "Flat-screen TV", icon: Tv },
        { name: "Heating", icon: Snowflake },
        { name: "Beachfront", icon: Anchor },
    ];

    const propertyTypes = ["Hotels", "Resorts", "Villas", "Apartments", "Motels", "Bed & Breakfast"];

    // USA Hotels Data
    const hotels = [
        // New York Hotels
        { id: 1, name: "The Plaza Hotel", location: "Fifth Avenue, New York", price: 895, rating: 4.9, reviews: 5234, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Fitness Center", "Restaurant", "Flat-screen TV"], discount: 15 },
        { id: 2, name: "The Manhattan Retreat", location: "Times Square, New York", price: 349, rating: 4.6, reviews: 3241, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV"], discount: 25 },
        { id: 3, name: "Brooklyn Luxury Suites", location: "Brooklyn, New York", price: 279, rating: 4.5, reviews: 1892, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1400&auto=format&fit=crop", type: "Apartments", amenities: ["Free WiFi", "Free Parking", "Kitchen"], discount: 20 },

        // Los Angeles Hotels
        { id: 4, name: "Beverly Hills Palace", location: "Beverly Hills, Los Angeles", price: 1299, rating: 4.9, reviews: 4321, image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Outdoor Pool", "Fitness Center", "Free Breakfast", "Restaurant"], discount: 18 },
        { id: 5, name: "Santa Monica Beach Resort", location: "Santa Monica, Los Angeles", price: 449, rating: 4.7, reviews: 2876, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Beachfront", "Outdoor Pool", "Free WiFi"], discount: 30 },
        { id: 6, name: "Hollywood Star Hotel", location: "Hollywood, Los Angeles", price: 299, rating: 4.4, reviews: 1987, image: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV"], discount: 22 },

        // Las Vegas Hotels
        { id: 7, name: "The Venetian Resort", location: "The Strip, Las Vegas", price: 599, rating: 4.8, reviews: 8765, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Outdoor Pool", "Restaurant", "Casino", "Fitness Center"], discount: 35 },
        { id: 8, name: "Bellagio Luxury Hotel", location: "Las Vegas Strip, Las Vegas", price: 749, rating: 4.9, reviews: 6543, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Outdoor Pool", "Restaurant", "Free WiFi", "Spa"], discount: 28 },

        // Miami Hotels
        { id: 9, name: "South Beach Resort", location: "South Beach, Miami", price: 529, rating: 4.7, reviews: 3456, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Beachfront", "Outdoor Pool", "Free Breakfast"], discount: 32 },
        { id: 10, name: "Miami Downtown Suites", location: "Downtown, Miami", price: 249, rating: 4.3, reviews: 1876, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Parking", "Air Conditioning"], discount: 15 },

        // Orlando Hotels (Disney World)
        { id: 11, name: "Walt Disney World Resort", location: "Lake Buena Vista, Orlando", price: 689, rating: 4.9, reviews: 9876, image: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Outdoor Pool", "Free Breakfast", "Shuttle Service", "Kids Club"], discount: 40 },
        { id: 12, name: "Universal's Cabana Bay", location: "Universal Blvd, Orlando", price: 299, rating: 4.6, reviews: 5432, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Outdoor Pool", "Free WiFi", "Fitness Center"], discount: 25 },

        // Chicago Hotels
        { id: 13, name: "The Langham Chicago", location: "Michigan Avenue, Chicago", price: 649, rating: 4.9, reviews: 2345, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Indoor Pool", "Spa", "Restaurant", "Fitness Center"], discount: 20 },
        { id: 14, name: "Chicago Downtown Hotel", location: "The Loop, Chicago", price: 279, rating: 4.5, reviews: 1876, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV"], discount: 18 },

        // San Francisco Hotels
        { id: 15, name: "Fairmont San Francisco", location: "Nob Hill, San Francisco", price: 599, rating: 4.8, reviews: 2987, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Fitness Center", "Restaurant", "Free WiFi", "Spa"], discount: 25 },
        { id: 16, name: "Fisherman's Wharf Inn", location: "Fisherman's Wharf, San Francisco", price: 249, rating: 4.3, reviews: 1654, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop", type: "Motels", amenities: ["Free Parking", "Free WiFi", "Breakfast"], discount: 12 },

        // Seattle Hotels
        { id: 17, name: "Edgewater Hotel", location: "Pier 67, Seattle", price: 399, rating: 4.7, reviews: 1876, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Waterfront", "Restaurant", "Free WiFi"], discount: 22 },

        // Boston Hotels
        { id: 18, name: "The Liberty Hotel", location: "Beacon Hill, Boston", price: 449, rating: 4.8, reviews: 2341, image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Fitness Center", "Restaurant", "Free WiFi"], discount: 20 },

        // Washington DC Hotels
        { id: 19, name: "The Watergate Hotel", location: "Foggy Bottom, Washington DC", price: 529, rating: 4.7, reviews: 1987, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Outdoor Pool", "Spa", "Restaurant"], discount: 28 },

        // Austin Hotels
        { id: 20, name: "The Driskill Hotel", location: "Downtown, Austin", price: 379, rating: 4.8, reviews: 1876, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Restaurant", "Fitness Center"], discount: 25 },

        // Denver Hotels
        { id: 21, name: "The Crawford Hotel", location: "Union Station, Denver", price: 349, rating: 4.7, reviews: 1654, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Restaurant", "Fitness Center"], discount: 20 },

        // Nashville Hotels
        { id: 22, name: "The Gulch Hotel", location: "The Gulch, Nashville", price: 329, rating: 4.7, reviews: 1987, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Restaurant", "Rooftop Bar"], discount: 18 },

        // New Orleans Hotels
        { id: 23, name: "The Roosevelt Hotel", location: "French Quarter, New Orleans", price: 399, rating: 4.8, reviews: 2345, image: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Outdoor Pool", "Spa", "Restaurant"], discount: 30 },

        // San Diego Hotels
        { id: 24, name: "Hotel Del Coronado", location: "Coronado, San Diego", price: 699, rating: 4.9, reviews: 3456, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Beachfront", "Outdoor Pool", "Spa", "Restaurant"], discount: 35 },

        // Honolulu Hotels (Hawaii)
        { id: 25, name: "Waikiki Beach Resort", location: "Waikiki, Honolulu", price: 549, rating: 4.8, reviews: 4321, image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Beachfront", "Outdoor Pool", "Free Breakfast", "Spa"], discount: 28 },

        // Phoenix Hotels
        { id: 26, name: "Arizona Biltmore", location: "Phoenix, Arizona", price: 399, rating: 4.7, reviews: 1876, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Outdoor Pool", "Golf Course", "Spa"], discount: 25 },

        // Portland Hotels
        { id: 27, name: "The Nines Hotel", location: "Downtown, Portland", price: 329, rating: 4.7, reviews: 1654, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Free WiFi", "Restaurant", "Fitness Center"], discount: 22 },

        // Atlanta Hotels
        { id: 28, name: "The Whitley Hotel", location: "Buckhead, Atlanta", price: 359, rating: 4.7, reviews: 1987, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Outdoor Pool", "Restaurant", "Spa"], discount: 20 },

        // Dallas Hotels
        { id: 29, name: "The Joule Hotel", location: "Downtown, Dallas", price: 389, rating: 4.8, reviews: 1765, image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1400&auto=format&fit=crop", type: "Hotels", amenities: ["Rooftop Pool", "Restaurant", "Spa"], discount: 25 },

        // Luxury Mountain Resort
        { id: 30, name: "Aspen Mountain Lodge", location: "Aspen, Colorado", price: 899, rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1400&auto=format&fit=crop", type: "Resorts", amenities: ["Ski-in/Ski-out", "Heating", "Spa", "Restaurant"], discount: 30 },
    ];

    const nights = differenceInDays(dateRange[0].endDate, dateRange[0].startDate);

    // Check if any filter is active
    const isAnyFilterActive =
        selectedPrice !== 300 ||
        selectedRatings.length > 0 ||
        selectedAmenities.length > 0 ||
        selectedPropertyTypes.length > 0;

    // Clear all filters function
    const clearAllFilters = () => {
        setSelectedPrice(300);
        setSelectedRatings([]);
        setSelectedAmenities([]);
        setSelectedPropertyTypes([]);
    };

    const filteredHotels = useMemo(() => {
        let filtered = hotels.filter((hotel) => {
            const matchSearch =
                destination.trim() === "" ||
                hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
                hotel.name.toLowerCase().includes(destination.toLowerCase());

            const matchPrice = hotel.price <= selectedPrice;

            const matchRating =
                selectedRatings.length === 0 ||
                selectedRatings.some((r) => hotel.rating >= r);

            const matchAmenities =
                selectedAmenities.length === 0 ||
                selectedAmenities.every((a) => hotel.amenities.includes(a));

            const matchProperty =
                selectedPropertyTypes.length === 0 ||
                selectedPropertyTypes.includes(hotel.type);

            return (
                matchSearch &&
                matchPrice &&
                matchRating &&
                matchAmenities &&
                matchProperty
            );
        });

        if (sortBy === "priceLowHigh") {
            filtered.sort((a, b) => a.price - b.price);
        }

        if (sortBy === "priceHighLow") {
            filtered.sort((a, b) => b.price - a.price);
        }

        if (sortBy === "highestRated") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    }, [
        destination,
        selectedPrice,
        selectedRatings,
        selectedAmenities,
        selectedPropertyTypes,
        sortBy,
    ]);

    // Close mobile filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileFilterRef.current && !mobileFilterRef.current.contains(e.target) && showMobileFilters) {
                setShowMobileFilters(false);
            }
            if (destinationRef.current && !destinationRef.current.contains(e.target)) {
                setShowDestination(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMobileFilters]);

    // Prevent body scroll when mobile filter is open
    useEffect(() => {
        if (showMobileFilters) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showMobileFilters]);

    // Filter content component (reused for desktop and mobile)
    const FilterContent = ({ onClose }) => (
        <div className="bg-white rounded-[30px] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-xl">Filters</h2>
                <div className="flex items-center gap-2">
                    {isAnyFilterActive && (
                        <button
                            onClick={clearAllFilters}
                            className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-2 hover:bg-red-100 transition-all"
                        >
                            <FilterX size={16} />
                            Clear All
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* PRICE */}
            <div className="mb-7">
                <div className="flex justify-between mb-3">
                    <p className="font-semibold">Price Per Night</p>
                    <p className="font-bold text-blue-600">${selectedPrice.toLocaleString()}</p>
                </div>

                <input
                    type="range"
                    min="10"
                    max="600"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
            </div>

            {/* RATINGS */}
            <div className="mb-7">
                <p className="font-semibold mb-3">Star Rating</p>

                <div className="space-y-3">
                    {[5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedRatings.includes(rating)}
                                onChange={() => {
                                    if (selectedRatings.includes(rating)) {
                                        setSelectedRatings(selectedRatings.filter((r) => r !== rating));
                                    } else {
                                        setSelectedRatings([...selectedRatings, rating]);
                                    }
                                }}
                                className="cursor-pointer"
                            />

                            <div className="flex items-center gap-1">
                                {Array.from({ length: rating }).map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* PROPERTY TYPE */}
            <div className="mb-7">
                <p className="font-semibold mb-3">Property Type</p>

                <div className="space-y-3">
                    {propertyTypes.map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedPropertyTypes.includes(type)}
                                onChange={() => {
                                    if (selectedPropertyTypes.includes(type)) {
                                        setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
                                    } else {
                                        setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                                    }
                                }}
                                className="cursor-pointer"
                            />

                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* AMENITIES */}
            <div>
                <p className="font-semibold mb-3">Amenities</p>

                <div className="space-y-3">
                    {amenities.map((item) => {
                        const Icon = item.icon;

                        return (
                            <label key={item.name} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(item.name)}
                                    onChange={() => {
                                        if (selectedAmenities.includes(item.name)) {
                                            setSelectedAmenities(selectedAmenities.filter((a) => a !== item.name));
                                        } else {
                                            setSelectedAmenities([...selectedAmenities, item.name]);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />

                                <Icon size={16} />
                                <span>{item.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            {/* HERO */}
            <div className="bg-gradient-to-r from-[#051937] via-[#004d7a] to-[#008793] pb-24">
                <div className="max-w-7xl mx-auto px-4 pt-10">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-black">Book Hotels & Homestays</h1>
                        <p className="mt-4 text-white/80 text-lg">Best prices. Premium stays. Instant confirmation.</p>
                    </div>

                    {/* SEARCH CARD */}
                    <div className="bg-white rounded-[34px] mt-10 shadow-[0_25px_80px_rgba(0,0,0,0.16)] p-5">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                            {/* DESTINATION */}
                            <div ref={destinationRef} className="xl:col-span-4 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">City / Area / Property</label>

                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={20} />

                                    <input
                                        value={destinationInput}
                                        onFocus={() => setShowDestination(true)}
                                        onChange={(e) => setDestinationInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setDestination(destinationInput);
                                                setShowDestination(false);
                                            }
                                        }}
                                        placeholder="Search destinations"
                                        className="h-[74px] w-full border border-gray-200 rounded-3xl pl-14 pr-5 font-bold text-lg outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {showDestination && (
                                    <div className="absolute top-[105%] left-0 w-full bg-white rounded-3xl border shadow-2xl z-50 overflow-hidden max-h-[320px] overflow-y-auto">
                                        {destinations
                                            .filter((city) => city.toLowerCase().includes(destinationInput.toLowerCase()))
                                            .map((city) => (
                                                <button
                                                    key={city}
                                                    onClick={() => {
                                                        setDestinationInput(city);
                                                        setDestination(city);
                                                        setShowDestination(false);
                                                    }}
                                                    className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b"
                                                >
                                                    <p className="font-semibold">{city}</p>
                                                    <p className="text-sm text-gray-500">USA</p>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* DATES */}
                            <div className="xl:col-span-4 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Check-In & Check-Out</label>

                                <button onClick={() => setShowCalendar(!showCalendar)} className="h-[74px] w-full border border-gray-200 rounded-3xl px-5 flex items-center justify-between hover:border-blue-500 transition-all">
                                    <div className="flex items-center gap-4">
                                        <CalendarDays className="text-blue-600" />

                                        <div className="text-left">
                                            <p className="font-bold text-lg text-black">{format(dateRange[0].startDate, "dd MMM")} - {format(dateRange[0].endDate, "dd MMM")}</p>
                                            <p className="text-sm text-gray-500">{nights} Nights</p>
                                        </div>
                                    </div>

                                    <ChevronDown size={18} />
                                </button>

                                {showCalendar && (
                                    <>
                                        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowCalendar(false)} />

                                        <div className="absolute top-[105%] left-1/2 -translate-x-1/2 xl:left-0 xl:translate-x-0 z-50 bg-white rounded-[28px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
                                            <DateRange
                                                editableDateInputs
                                                moveRangeOnFirstSelection={false}
                                                ranges={dateRange}
                                                months={2}
                                                direction="horizontal"
                                                minDate={new Date()}
                                                rangeColors={["#2563eb"]}
                                                onChange={(item) => {
                                                    const selection = item.selection;

                                                    setDateRange([selection]);

                                                    if (!isSelectingDate) {
                                                        setIsSelectingDate(true);
                                                    } else {
                                                        setIsSelectingDate(false);
                                                        setTimeout(() => setShowCalendar(false), 120);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* GUESTS */}
                            <div className="xl:col-span-3 relative">
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Rooms & Guests</label>

                                <button onClick={() => setShowGuests(!showGuests)} className="h-[74px] w-full border border-gray-200 rounded-3xl px-5 flex items-center justify-between hover:border-blue-500 transition-all">
                                    <div className="flex items-center gap-4">
                                        <Users className="text-blue-600" />

                                        <div className="text-left">
                                            <p className="font-bold text-lg">{guests.rooms} Room, {guests.adults + guests.children} Guests</p>
                                            <p className="text-sm text-gray-500">{guests.adults} Adults</p>
                                        </div>
                                    </div>

                                    <ChevronDown size={18} />
                                </button>

                                {showGuests && (
                                    <div className="absolute top-[105%] right-0 w-full bg-white rounded-3xl shadow-2xl border z-50 p-5">
                                        {["adults", "children", "rooms"].map((key) => (
                                            <div key={key} className="flex items-center justify-between py-4 border-b last:border-none">
                                                <p className="font-semibold capitalize">{key}</p>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setGuests((prev) => ({ ...prev, [key]: Math.max(key === "adults" || key === "rooms" ? 1 : 0, prev[key] - 1) }))}
                                                        className="w-9 h-9 rounded-full bg-gray-100 font-bold hover:bg-gray-200 transition-all"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="font-bold">{guests[key]}</span>

                                                    <button
                                                        onClick={() => setGuests((prev) => ({ ...prev, [key]: prev[key] + 1 }))}
                                                        className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SEARCH */}
                            <div className="xl:col-span-1 flex items-end">
                                <button
                                    onClick={() => {
                                        setDestination(destinationInput);
                                        setShowDestination(false);
                                    }}
                                    className="h-[74px] w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xl hover:scale-[1.03] transition-all"
                                >
                                    <Search size={26} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 mt-5 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* DESKTOP FILTERS */}
                    <div className="hidden lg:block lg:col-span-3">
                        <FilterContent />
                    </div>

                    {/* MOBILE FILTER BUTTON */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="h-12 px-6 rounded-2xl bg-white border border-gray-200 font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                            {isAnyFilterActive && (
                                <span className="ml-1 w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            )}
                        </button>

                        {isAnyFilterActive && (
                            <button
                                onClick={clearAllFilters}
                                className="h-12 px-5 rounded-2xl bg-red-50 text-red-600 font-semibold flex items-center gap-2 hover:bg-red-100 transition-all"
                            >
                                <FilterX size={16} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* MOBILE FILTERS MODAL */}
                    {showMobileFilters && (
                        <>
                            <div
                                className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300"
                                onClick={() => setShowMobileFilters(false)}
                            />
                            <div
                                ref={mobileFilterRef}
                                className="fixed right-0 top-10 h-full w-full max-w-[400px] bg-white z-[1001] shadow-2xl overflow-y-auto transition-transform duration-300 transform translate-x-0 rounded-l-3xl"
                            >
                                <div className="p-5">
                                    <FilterContent onClose={() => setShowMobileFilters(false)} />

                                    {/* Apply Button for Mobile */}
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="mt-6 w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* HOTELS */}
                    <div className="lg:col-span-9">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-3xl font-black">Hotels in {destination || "India"}</h2>
                                <p className="text-gray-500 mt-1">{filteredHotels.length} properties found</p>
                            </div>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-12 px-5 pr-10 rounded-2xl bg-white border font-semibold outline-none appearance-none cursor-pointer hover:border-blue-400 transition-all"
                                >
                                    <option value="">Sort By</option>
                                    <option value="priceLowHigh">Price: Low to High</option>
                                    <option value="priceHighLow">Price: High to Low</option>
                                    <option value="highestRated">Highest Rated</option>
                                </select>

                                <ArrowUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            {filteredHotels.map((hotel) => (
                                <div key={hotel.id} className="bg-white rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl transition-all border">
                                    <div className="grid grid-cols-1 md:grid-cols-12">
                                        {/* IMAGE */}
                                        <div className="md:col-span-4 relative">
                                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover md:h-[280px]" />

                                            <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center backdrop-blur hover:bg-white transition-all">
                                                <Heart size={18} />
                                            </button>

                                            <div className="absolute left-4 bottom-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {hotel.discount}% OFF
                                            </div>
                                        </div>

                                        {/* INFO */}
                                        <div className="md:col-span-8 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-2xl font-black">{hotel.name}</h3>

                                                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                                                            <MapPin size={16} />
                                                            {hotel.location}
                                                        </p>
                                                    </div>

                                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-center min-w-[90px]">
                                                        <p className="text-2xl font-black">{hotel.rating}</p>
                                                        <p className="text-xs">{hotel.reviews} reviews</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 mt-6">
                                                    {hotel.amenities.slice(0, 4).map((a) => (
                                                        <div key={a} className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium">
                                                            {a}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                                                <div>
                                                    <p className="text-sm text-gray-400">Per night</p>

                                                    <div className="flex items-end gap-2">
                                                        <h2 className="text-4xl font-black text-black">${hotel.price.toLocaleString()}</h2>
                                                        <span className="text-green-600 font-semibold mb-1">+ taxes</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button className="h-14 px-6 rounded-2xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all">
                                                        View Details
                                                    </button>

                                                    <button
                                                        onClick={() => navigate("/hotel-booking", {
                                                            state: {
                                                                hotel: hotel,
                                                                searchParams: {
                                                                    checkIn: dateRange[0].startDate,
                                                                    checkOut: dateRange[0].endDate,
                                                                    guests: guests,
                                                                    rooms: guests.rooms
                                                                }
                                                            }
                                                        })}
                                                        className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold shadow-xl hover:scale-[1.02] transition-all"
                                                    >
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredHotels.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl">
                                <p className="text-gray-500 text-lg">No hotels found matching your criteria</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBooking;