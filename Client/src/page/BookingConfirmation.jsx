import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Mail, CalendarDays, Users, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData } = location.state || {};

    if (!bookingData) {
        navigate("/hotels");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-500 mb-6">Your reservation has been confirmed successfully</p>

                <div className="bg-gray-50 rounded-2xl p-6 text-left mb-6">
                    <p className="text-sm text-gray-500 mb-2">Booking ID</p>
                    <p className="font-mono font-bold text-lg mb-4">{bookingData.bookingId}</p>

                    <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-blue-600" />
                            <div>
                                <p className="font-semibold">{bookingData.hotel.name}</p>
                                <p className="text-sm text-gray-500">{bookingData.hotel.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CalendarDays size={18} className="text-blue-600" />
                            <div>
                                <p className="font-semibold">
                                    {format(new Date(bookingData.checkIn), "MMM dd, yyyy")} - {format(new Date(bookingData.checkOut), "MMM dd, yyyy")}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {Math.ceil((bookingData.checkOut - bookingData.checkIn) / (1000 * 60 * 60 * 24))} nights
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users size={18} className="text-blue-600" />
                            <div>
                                <p className="font-semibold">
                                    {bookingData.guests.adults + bookingData.guests.children} Guests, {bookingData.guests.rooms} Room
                                </p>
                                <p className="text-sm text-gray-500">
                                    {bookingData.guests.adults} Adults{bookingData.guests.children > 0 ? `, ${bookingData.guests.children} Children` : ""}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CreditCard size={18} className="text-blue-600" />
                            <div>
                                <p className="font-semibold">Total Paid</p>
                                <p className="text-sm text-gray-500">${bookingData.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate("/hotels")}
                        className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
                    >
                        Back to Search
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Download Invoice
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    A confirmation email has been sent to {bookingData.guestDetails.email}
                </p>
            </div>
        </div>
    );
};

export default BookingConfirmation;