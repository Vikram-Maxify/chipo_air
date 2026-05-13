// pages/AllOffers.jsx

import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    CalendarDays,
} from "lucide-react";

import {
    getAllTravelOffers,
} from "../reducer/slice/userOfferSlice";

const AllOffers = () => {

    const dispatch =
        useDispatch();

    const {
        offers,
        loading,
        error,
    } = useSelector(
        (state) =>
            state.userOffer
    );

    // ================= FETCH OFFERS =================

    useEffect(() => {

        dispatch(
            getAllTravelOffers()
        );

    }, [dispatch]);

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    // ================= ERROR =================

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
                {typeof error ===
                    "string"
                    ? error
                    : error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] py-6 px-3">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f]">
                            All Offers
                        </h1>

                        <p className="text-gray-500 mt-1 text-sm md:text-base">
                            Explore latest
                            travel deals &
                            offers
                        </p>

                    </div>
                </div>

                {/* OFFERS GRID */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                    {offers &&
                        offers.length >
                        0 ? (

                        offers.map(
                            (
                                offer
                            ) => (

                                <a
                                    href={
                                        offer.redirectUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    key={
                                        offer._id
                                    }
                                    className="bg-white rounded-[20px] overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300"
                                >

                                    {/* IMAGE */}

                                    <div className="relative">

                                        <img
                                            src={
                                                offer.image
                                            }
                                            alt={
                                                offer.title
                                            }
                                            className="w-full h-[150px] object-cover"
                                        />

                                        {/* CATEGORY */}

                                        {offer.category && (

                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2276e3] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">

                                                {
                                                    offer.category
                                                }

                                            </div>

                                        )}
                                    </div>

                                    {/* CONTENT */}

                                    <div className="p-4">

                                        {/* TITLE */}

                                        <h2 className="text-[20px] leading-[28px] font-bold text-[#1f1f1f] line-clamp-2">

                                            {
                                                offer.title
                                            }

                                        </h2>

                                        {/* DESCRIPTION */}

                                        {offer.description && (

                                            <p className="text-gray-500 text-sm mt-2 leading-relaxed line-clamp-2">

                                                {
                                                    offer.description
                                                }

                                            </p>

                                        )}

                                        {/* FOOTER */}

                                        <div className="flex items-center justify-between mt-4">

                                            {/* DATE */}

                                            <div className="flex items-center gap-2 text-gray-500 text-sm">

                                                <CalendarDays
                                                    size={
                                                        16
                                                    }
                                                />

                                                <span>
                                                    {offer.validTill
                                                        ? new Date(
                                                            offer.validTill
                                                        ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "numeric",
                                                                month:
                                                                    "short",
                                                            }
                                                        )
                                                        : "N/A"}
                                                </span>

                                            </div>

                                            {/* BUTTON */}

                                            <div className="bg-[#2276e3] text-white text-sm font-semibold px-4 py-2 rounded-xl">

                                                Explore

                                            </div>
                                        </div>
                                    </div>
                                </a>
                            )
                        )

                    ) : (

                        <div className="col-span-full flex justify-center items-center py-16">

                            <h2 className="text-lg text-gray-500 font-medium">
                                No Offers Found
                            </h2>

                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default AllOffers;