// pages/Offers.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    ChevronRight,
    CalendarDays,
} from "lucide-react";

import {
    getAllTravelOffers,
} from "../reducer/slice/userOfferslice";
import { Link } from "react-router-dom";

const Offers = () => {

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

    const [activeCategory,
        setActiveCategory] =
        useState("All");

    useEffect(() => {
        dispatch(
            getAllTravelOffers()
        );
    }, [dispatch]);

    // ================= FILTER OFFERS =================

    const filteredOffers =
        activeCategory ===
            "All"
            ? offers
            : offers?.filter(
                (offer) =>
                    offer.category
                        ?.toLowerCase()
                        .includes(
                            activeCategory.toLowerCase()
                        )
            );

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    // ================= ERROR =================

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 text-xl">
                {typeof error ===
                    "string"
                    ? error
                    : error.message}
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f5f7fb] py-4 px-3">

    <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl md:text-3xl font-bold text-[#1f1f1f]">
                Offers For You
            </h2>

            <Link to={"/all_offers"} className="flex items-center gap-1 text-[#2276e3] font-semibold text-sm md:text-base">

                View All

                <ChevronRight
                    size={
                        18
                    }
                />
            </Link>
        </div>

        {/* OFFERS */}

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

            {filteredOffers &&
            filteredOffers.length >
                0 ? (

                filteredOffers.map(
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
                            className="min-w-[320px] md:min-w-[360px] bg-white rounded-[20px] overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300"
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

                                <h3 className="text-[20px] leading-[28px] font-bold text-[#1f1f1f] line-clamp-2">

                                    {
                                        offer.title
                                    }

                                </h3>

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

                <div className="w-full flex justify-center items-center py-16">

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

export default Offers;