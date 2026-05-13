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
        <div className="w-full bg-[#f5f5f5] py-10 px-4">

            <div className="max-w-7xl mx-auto bg-white rounded-[30px] shadow-sm border border-gray-200 p-7">

                {/* HEADER */}

                <div className="flex items-center justify-center relative mb-10">

                    <h2 className="text-4xl font-bold text-[#1f1f1f]">
                        Offers For
                        You
                    </h2>

                    <button className="absolute right-0 flex items-center gap-1 text-[#2563eb] font-semibold text-xl">
                        View All

                        <ChevronRight
                            size={
                                22
                            }
                        />
                    </button>
                </div>

                {/* OFFERS SCROLL */}

                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">

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
                                    className="min-w-[420px] bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
                                >

                                    {/* IMAGE */}

                                    <div className="p-4 pb-0">
                                        <img
                                            src={
                                                offer.image
                                            }
                                            alt={
                                                offer.title
                                            }
                                            className="w-full h-[210px] object-cover rounded-[18px]"
                                        />
                                    </div>

                                    {/* CONTENT */}

                                    <div className="p-4">

                                        {/* CATEGORY */}

                                        <p className="text-gray-500 text-lg mb-2">
                                            {
                                                offer.category
                                            }
                                        </p>

                                        {/* TITLE */}

                                        <h3 className="text-[28px] leading-[36px] font-bold text-[#1f1f1f] mb-4 line-clamp-2">
                                            {
                                                offer.title
                                            }
                                        </h3>

                                        {/* VALID DATE */}

                                        <div className="flex items-center gap-2 text-gray-500 text-lg">

                                            <CalendarDays
                                                size={
                                                    18
                                                }
                                            />

                                            <span>
                                                Valid
                                                till{" "}
                                                {offer.validTill
                                                    ? new Date(
                                                        offer.validTill
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "numeric",
                                                            month:
                                                                "short",
                                                            year: "2-digit",
                                                        }
                                                    )
                                                    : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            )
                        )
                    ) : (
                        <div className="w-full flex justify-center items-center py-20">
                            <h2 className="text-2xl text-gray-500 font-medium">
                                No Offers
                                Found
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;