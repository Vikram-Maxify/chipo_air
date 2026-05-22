import React from "react";
import { ArrowLeftRight, ChevronDown, MapPin, Plane, Search, Users } from "lucide-react";
import { DateRange } from "react-date-range";

const PhoneSearchBar = ({ tripType, setTripType, from, setFrom, to, setTo, fromCode, setFromCode, toCode, setToCode, fromSuggestions, setFromSuggestions, toSuggestions, setToSuggestions, searchAirports, getAirportInfo, swapLocations, departureRef, calendarRef, showCalendar, setShowCalendar, dateRange, formatDate, handleDateSelect, isMobile, travellers, adults, children, infants, showTravellerDropdown, setShowTravellerDropdown, setAdults, setChildren, setInfants, travelClass, setTravelClass, handleSearch }) => {
    return (
        <div className="relative z-[50] max-w-7xl mx-auto px-3 md:px-4 pt-4 pb-4 md:pt-10 overflow-x-hidden md:hidden">

            {/* HEADER */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-2">
                    <Plane className="text-white w-3 h-3" />
                    <span className="text-white text-xs font-medium">
                        Best Flight Deals
                    </span>
                </div>

                <h1 className="text-xl font-bold text-white leading-tight px-2">
                    Domestic and International Flights
                </h1>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-[20px] shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-3 overflow-x-hidden">

                {/* TOP */}
                <div className="flex flex-col justify-between gap-3 mb-4">

                    <div className="flex flex-wrap gap-3 px-1">

                        {[
                            { key: "oneway", label: "Oneway" },
                            { key: "roundtrip", label: "Round Trip" },
                        ].map((item) => (

                            <button
                                key={item.key}
                                onClick={() => setTripType(item.key)}
                                className={`flex items-center gap-1.5 font-semibold text-sm ${tripType === item.key ? "text-blue-600" : "text-gray-500"}`}
                            >

                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === item.key ? "border-blue-600" : "border-gray-400"}`}>

                                    {tripType === item.key && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    )}

                                </div>

                                {item.label}

                            </button>

                        ))}

                    </div>

                    <p className="text-gray-600 font-medium text-xs px-1">
                        Book International and Domestic Flights
                    </p>

                </div>

                {/* SEARCH GRID */}
                <div className="relative border border-gray-300 rounded-[16px] bg-white overflow-hidden">

                    {/* FROM */}
                    <div className="from-wrapper relative p-3 border-b border-gray-300">

                        <p className="text-gray-500 text-xs mb-1">
                            From
                        </p>

                        <input
                            type="text"
                            value={from}
                            onChange={(e) => {
                                const value = e.target.value;

                                setFrom(value);
                                setFromCode("");

                                if (value.length > 1) {
                                    setFromSuggestions(searchAirports(value));
                                } else {
                                    setFromSuggestions([]);
                                }
                            }}
                            placeholder="Departure"
                            className="w-full text-lg font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                        />

                        {fromSuggestions.length > 0 && (

                            <div className="absolute left-0 top-[100%] w-full bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[99999] max-h-[250px] overflow-y-auto border border-gray-200">

                                {fromSuggestions.map((airport, index) => {

                                    const { city, name, code, country } =
                                        getAirportInfo(airport);

                                    return (

                                        <button
                                            key={`${code}-${index}`}
                                            onClick={() => {
                                                setFrom(`${city} (${code})`);
                                                setFromCode(code);
                                                setFromSuggestions([]);
                                            }}
                                            className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                        >

                                            <div className="flex items-center justify-between gap-2">

                                                <div className="flex-1 min-w-0">

                                                    <div className="font-semibold text-black text-sm truncate">
                                                        {city}{country ? `, ${country}` : ""}
                                                    </div>

                                                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                                                        {name}
                                                    </div>

                                                </div>

                                                {code && (
                                                    <div className="bg-blue-50 text-blue-700 font-mono font-bold px-2 py-1 rounded-lg text-xs flex-shrink-0">
                                                        {code}
                                                    </div>
                                                )}

                                            </div>

                                        </button>

                                    );

                                })}

                            </div>

                        )}

                    </div>

                    {/* SWAP */}
                    <div className="flex justify-center -my-2 relative z-40">

                        <button
                            onClick={swapLocations}
                            type="button"
                            className="w-7 h-7 rounded-full shadow-lg bg-white border border-gray-200 flex items-center justify-center"
                        >

                            <ArrowLeftRight className="text-blue-600 w-3 h-3" />

                        </button>

                    </div>

                    {/* TO */}
                    <div className="to-wrapper relative p-3 border-b border-gray-300">

                        <p className="text-gray-500 text-xs mb-1">
                            To
                        </p>

                        <input
                            type="text"
                            value={to}
                            onChange={(e) => {
                                const value = e.target.value;

                                setTo(value);
                                setToCode("");

                                if (value.length > 1) {
                                    setToSuggestions(searchAirports(value));
                                } else {
                                    setToSuggestions([]);
                                }
                            }}
                            placeholder="Destination"
                            className="w-full text-lg font-bold outline-none bg-transparent text-black placeholder:text-gray-300"
                        />

                        {toSuggestions.length > 0 && (

                            <div className="absolute left-0 top-[100%] w-full bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-[9999999] max-h-[250px] overflow-y-auto border border-gray-200">

                                {toSuggestions.map((airport, index) => {

                                    const { city, name, code, country } =
                                        getAirportInfo(airport);

                                    return (

                                        <button
                                            key={`${code}-${index}`}
                                            onClick={() => {

                                                setTo(`${city} (${code})`);
                                                setToCode(code);
                                                setToSuggestions([]);

                                            }}
                                            className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                        >

                                            <div className="flex items-center justify-between gap-2">

                                                <div className="flex-1 min-w-0">

                                                    <div className="font-semibold text-black text-sm truncate">
                                                        {city}{country ? `, ${country}` : ""}
                                                    </div>

                                                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                                                        {name}
                                                    </div>

                                                </div>

                                                {code && (

                                                    <div className="bg-blue-50 text-blue-700 font-mono font-bold px-2 py-1 rounded-lg text-xs flex-shrink-0">
                                                        {code}
                                                    </div>

                                                )}

                                            </div>

                                        </button>

                                    );

                                })}

                            </div>

                        )}
                    </div>

                    {/* DATE */}
                    <div className="grid grid-cols-2">

                        <div
                            ref={departureRef}
                            className="p-3 border-r border-gray-300"
                        >

                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="w-full text-left"
                            >

                                <div className="flex items-center gap-1 mb-1">

                                    <p className="text-gray-500 text-xs">
                                        Departure
                                    </p>

                                    <ChevronDown size={10} className="text-blue-600" />

                                </div>

                                <div className="text-sm font-bold text-black">
                                    {formatDate(dateRange[0].startDate)}
                                </div>

                            </button>

                        </div>

                        <div className="p-3">

                            <p className="text-gray-500 text-xs mb-1">
                                Return
                            </p>

                            <div className="text-sm font-bold text-black">
                                {tripType === "oneway"
                                    ? "--"
                                    : formatDate(dateRange[0].endDate)}
                            </div>

                        </div>

                    </div>

                    {/* CALENDAR */}
                    {showCalendar && isMobile && (

                        <div
                            ref={calendarRef}
                            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-3"
                        >

                            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-full max-w-[95vw]">

                                <div className="p-3 max-h-[70vh] overflow-auto">

                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={handleDateSelect}
                                        moveRangeOnFirstSelection={false}
                                        retainEndDateOnFirstSelection={false}
                                        ranges={dateRange}
                                        months={1}
                                        direction="vertical"
                                        minDate={new Date()}
                                        showDateDisplay={false}
                                        rangeColors={["#2563eb"]}
                                    />

                                </div>

                                <button
                                    onClick={() => setShowCalendar(false)}
                                    className="w-full py-2.5 bg-blue-600 text-white font-semibold text-sm"
                                >
                                    Done
                                </button>

                            </div>

                        </div>

                    )}
                    {/* TRAVELLERS */}
                    <div className="p-3 border-t border-gray-300">

                        <div className="flex items-center gap-1 mb-1">
                            <p className="text-gray-500 text-xs">
                                Travellers & Class
                            </p>
                        </div>

                        <div
                            onClick={() =>
                                setShowTravellerDropdown(!showTravellerDropdown)
                            }
                            className="cursor-pointer"
                        >

                            <div className="flex items-center gap-2 flex-wrap">

                                <Users
                                    size={14}
                                    className="text-blue-600"
                                />

                                <h2 className="text-lg font-bold text-gray-900">
                                    {travellers}
                                </h2>

                                <span className="text-gray-500 text-sm">
                                    Travellers
                                </span>

                            </div>

                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 font-medium mt-1">

                                <span>
                                    {adults} Adult
                                </span>

                                {children > 0 && (
                                    <>
                                        <span className="text-gray-300">
                                            •
                                        </span>

                                        <span>
                                            {children} Child
                                        </span>
                                    </>
                                )}

                                {infants > 0 && (
                                    <>
                                        <span className="text-gray-300">
                                            •
                                        </span>

                                        <span>
                                            {infants} Infant
                                        </span>
                                    </>
                                )}

                            </div>

                            <p className="mt-1 text-gray-500 text-xs truncate">
                                {travelClass}
                            </p>

                        </div>

                    </div>

                </div>


                {/* SEARCH BUTTON */}
                <div className="flex justify-center mt-4 px-1">

                    <button
                        onClick={handleSearch}
                        className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-bold shadow-2xl flex items-center justify-center gap-2"
                    >

                        <Search size={16} />

                        SEARCH

                    </button>

                </div>

                {showTravellerDropdown && (

                    <div className="fixed inset-0 z-[999999] md:hidden">

                        {/* BACKDROP */}
                        <div
                            onClick={() =>
                                setShowTravellerDropdown(false)
                            }
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* BOTTOM SHEET */}
                        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.18)] overflow-hidden">

                            {/* HEADER */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Travellers & Class
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Select passengers
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowTravellerDropdown(false)
                                    }
                                    className="w-9 h-9 rounded-full bg-gray-100 text-gray-600"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* BODY */}
                            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

                                {[
                                    {
                                        title: "Adults",
                                        sub: "12+ Years",
                                        value: adults,
                                        setValue: setAdults,
                                        min: 1,
                                    },

                                    {
                                        title: "Children",
                                        sub: "2-11 Years",
                                        value: children,
                                        setValue: setChildren,
                                        min: 0,
                                    },

                                    {
                                        title: "Infants",
                                        sub: "Below 2 Years",
                                        value: infants,
                                        setValue: setInfants,
                                        min: 0,
                                    },

                                ].map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >

                                        <div>

                                            <h4 className="font-semibold text-gray-900">
                                                {item.title}
                                            </h4>

                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.sub}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-2 py-1.5">

                                            <button
                                                onClick={() =>
                                                    item.setValue(
                                                        item.value > item.min
                                                            ? item.value - 1
                                                            : item.min
                                                    )
                                                }
                                                className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg"
                                            >
                                                −
                                            </button>

                                            <span className="w-5 text-center font-bold text-gray-900">
                                                {item.value}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    item.setValue(
                                                        item.value + 1
                                                    )
                                                }
                                                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                ))}

                                {/* CLASS */}
                                <div className="pt-3 border-t border-gray-100">

                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Travel Class
                                    </h4>

                                    <div className="grid grid-cols-2 gap-2">

                                        {[
                                            "Economy",
                                            "Premium Economy",
                                            "Business",
                                            "First Class",
                                        ].map((item) => (

                                            <button
                                                key={item}
                                                onClick={() =>
                                                    setTravelClass(item)
                                                }
                                                className={`h-10 rounded-2xl border text-sm font-semibold transition-all ${travelClass === item
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "border-gray-200 text-gray-700"
                                                    }`}
                                            >

                                                {item}

                                            </button>

                                        ))}

                                    </div>

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="p-5 border-t border-gray-100">

                                <button
                                    onClick={() =>
                                        setShowTravellerDropdown(false)
                                    }
                                    className="w-full h-12 rounded-2xl bg-blue-600 text-white font-semibold"
                                >
                                    Apply
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default PhoneSearchBar;