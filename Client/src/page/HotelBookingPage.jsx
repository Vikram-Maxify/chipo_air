import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CalendarDays, Users, Bed, CreditCard, Shield,
    Wifi, Car, Coffee, Dumbbell, Waves, Wind,
    Utensils, Tv, Snowflake, Anchor, Check,
    ArrowLeft, Clock, MapPin, Star, Heart,
    ChevronDown, ChevronUp, Phone, Mail, MessageCircle
} from "lucide-react";
import { DateRange } from "react-date-range";
import { addDays, differenceInDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const HotelBookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotel, searchParams } = location.state || {};

    // If no hotel data, redirect back to search
    useEffect(() => {
        if (!hotel) {
            navigate("/hotels");
        }
    }, [hotel, navigate]);

    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuests, setShowGuests] = useState(false);
    const [isSelectingDate, setIsSelectingDate] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showFullDetails, setShowFullDetails] = useState(false);

    // Pre-fill from search params or use defaults
    const [dateRange, setDateRange] = useState([
        {
            startDate: searchParams?.checkIn ? new Date(searchParams.checkIn) : addDays(new Date(), 1),
            endDate: searchParams?.checkOut ? new Date(searchParams.checkOut) : addDays(new Date(), 4),
            key: "selection"
        },
    ]);

    const [guests, setGuests] = useState({
        adults: searchParams?.guests?.adults || 2,
        children: searchParams?.guests?.children || 0,
        rooms: searchParams?.rooms || 1
    });

    const [guestDetails, setGuestDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        specialRequests: ""
    });

    const nights = differenceInDays(dateRange[0].endDate, dateRange[0].startDate);
    const totalPrice = (hotel?.price || 0) * nights;
    const taxAmount = totalPrice * 0.12; // 12% tax
    const serviceFee = totalPrice * 0.05; // 5% service fee
    const grandTotal = totalPrice + taxAmount + serviceFee;

    const amenitiesIcons = {
        "Free WiFi": Wifi,
        "Free Parking": Car,
        "Free Breakfast": Coffee,
        "Fitness Center": Dumbbell,
        "Outdoor Pool": Waves,
        "Air Conditioning": Wind,
        "Restaurant": Utensils,
        "Flat-screen TV": Tv,
        "Heating": Snowflake,
        "Beachfront": Anchor,
    };

    const handleBookingSubmit = async () => {
        if (!guestDetails.fullName || !guestDetails.email || !guestDetails.phone) {
            alert("Please fill in all required fields");
            return;
        }
        if (!agreedToTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            const bookingData = {
                hotel: hotel,
                checkIn: dateRange[0].startDate,
                checkOut: dateRange[0].endDate,
                guests: guests,
                guestDetails: guestDetails,
                totalAmount: grandTotal,
                bookingDate: new Date(),
                bookingId: "H" + Math.random().toString(36).substr(2, 8).toUpperCase()
            };

            // Save to localStorage or send to backend
            console.log("Booking confirmed:", bookingData);

            setIsProcessing(false);

            // Navigate to confirmation page
            navigate("/booking-confirmation", { state: { bookingData } });
        }, 2000);
    };

    const formatDateDisplay = (date) => {
        return format(date, "EEE, MMM d, yyyy");
    };

    if (!hotel) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#051937] via-[#004d7a] to-[#008793] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:text-white/80 transition-all"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to search</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Hotel Details & Form */}
                    <div className="lg:col-span-8">
                        {/* Hotel Info Card */}
                        <div className="bg-white rounded-[30px] overflow-hidden shadow-sm mb-6">
                            <div className="relative h-[300px] md:h-[400px]">
                                <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                />
                                <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center backdrop-blur hover:bg-white transition-all">
                                    <Heart size={20} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">{hotel.name}</h1>
                                    <p className="text-white/90 flex items-center gap-2 mt-2">
                                        <MapPin size={18} />
                                        {hotel.location}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-center">
                                        <p className="text-2xl font-black">{hotel.rating}</p>
                                        <p className="text-xs">{hotel.reviews.toLocaleString()} reviews</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                                                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                            <span className="ml-2 text-gray-600">Exceptional</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Verified Guest Reviews</p>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-6 pb-6 border-b">
                                    <h2 className="text-xl font-bold mb-4">Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {hotel.amenities.map((amenity) => {
                                            const Icon = amenitiesIcons[amenity] || Wifi;
                                            return (
                                                <div key={amenity} className="flex items-center gap-3">
                                                    <Icon size={18} className="text-blue-600" />
                                                    <span className="text-gray-700">{amenity}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Property Details Toggle */}
                                <button
                                    onClick={() => setShowFullDetails(!showFullDetails)}
                                    className="flex items-center justify-between w-full py-4 text-left border-b"
                                >
                                    <span className="font-semibold">Property details</span>
                                    {showFullDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>

                                {showFullDetails && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-gray-600 leading-relaxed">
                                            This property offers exceptional service and amenities to make your stay memorable.
                                            Located in the heart of {hotel.location.split(",")[0]}, you'll have easy access to
                                            major attractions, dining, and entertainment. The property features modern interiors,
                                            24/7 front desk service, concierge assistance, and daily housekeeping.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guest Details Form */}
                        <div className="bg-white rounded-[30px] p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Guest Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={guestDetails.fullName}
                                        onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={guestDetails.email}
                                        onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={guestDetails.phone}
                                        onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                        className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        value={guestDetails.specialRequests}
                                        onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                                        placeholder="e.g., Extra pillow, late check-in, high floor..."
                                        rows="3"
                                        className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[30px] p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

                            {/* Dates Summary */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <CalendarDays size={20} className="text-blue-600" />
                                    <div>
                                        <p className="font-semibold">Your Stay</p>
                                        <p className="text-sm text-gray-600">
                                            {formatDateDisplay(dateRange[0].startDate)} - {formatDateDisplay(dateRange[0].endDate)}
                                        </p>
                                        <p className="text-sm text-gray-500">{nights} nights</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="text-blue-600 text-sm font-semibold hover:underline"
                                >
                                    Change Dates
                                </button>
                            </div>

                            {/* Guests Summary */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users size={20} className="text-blue-600" />
                                    <div>
                                        <p className="font-semibold">Guests & Rooms</p>
                                        <p className="text-sm text-gray-600">
                                            {guests.adults + guests.children} Guests, {guests.rooms} Room
                                        </p>
                                        <p className="text-sm text-gray-500">{guests.adults} Adults, {guests.children} Children</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowGuests(!showGuests)}
                                    className="text-blue-600 text-sm font-semibold hover:underline"
                                >
                                    Change Guests
                                </button>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4 mb-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>${hotel.price} x {nights} nights</span>
                                        <span>${totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxes (12%)</span>
                                        <span>${taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Service Fee (5%)</span>
                                        <span>${serviceFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                                        <span>Total Amount</span>
                                        <span className="text-blue-600">${grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-4">
                                <p className="font-semibold mb-3">Payment Method</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="accent-blue-600"
                                        />
                                        <CreditCard size={18} />
                                        <span>Credit / Debit Card</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === "paypal"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="accent-blue-600"
                                        />
                                        <span className="font-semibold text-blue-600">PayPal</span>
                                    </label>
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 accent-blue-600"
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the <button className="text-blue-600 hover:underline">Terms of Service</button> and
                                    <button className="text-blue-600 hover:underline"> Cancellation Policy</button>
                                </span>
                            </label>

                            {/* Book Now Button */}
                            <button
                                onClick={handleBookingSubmit}
                                disabled={isProcessing}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    `Book Now - $${grandTotal.toLocaleString()}`
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                                <Shield size={14} />
                                Secure Booking. No hidden fees.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Modal */}
            {showCalendar && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={() => setShowCalendar(false)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-white rounded-3xl shadow-2xl p-4 w-[90vw] md:w-auto">
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
                        <button
                            onClick={() => setShowCalendar(false)}
                            className="mt-4 w-full py-3 rounded-xl bg-gray-100 font-semibold hover:bg-gray-200 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}

            {/* Guests Modal */}
            {showGuests && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={() => setShowGuests(false)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-white rounded-3xl shadow-2xl p-6 w-[90vw] max-w-md">
                        <h3 className="text-xl font-bold mb-4">Rooms & Guests</h3>

                        {["adults", "children", "rooms"].map((key) => (
                            <div key={key} className="flex items-center justify-between py-4 border-b last:border-none">
                                <p className="font-semibold capitalize">{key}</p>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setGuests((prev) => ({
                                            ...prev,
                                            [key]: Math.max(key === "adults" || key === "rooms" ? 1 : 0, prev[key] - 1)
                                        }))}
                                        className="w-9 h-9 rounded-full bg-gray-100 font-bold hover:bg-gray-200 transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold w-8 text-center">{guests[key]}</span>
                                    <button
                                        onClick={() => setGuests((prev) => ({ ...prev, [key]: prev[key] + 1 }))}
                                        className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowGuests(false)}
                            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold"
                        >
                            Apply
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HotelBookingPage;