// components/Banners.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getActiveBanners,
} from "../reducer/slice/userBannerSlice";

const Banners = ({
    index = 0,
    className = "",
    height = "h-[220px]",
}) => {

    const dispatch =
        useDispatch();

    const {
        banners,
        loading,
        error,
    } = useSelector(
        (state) =>
            state.userBanner
    );

    // ================= FETCH BANNERS =================

    useEffect(() => {

        if (
            !banners ||
            banners.length === 0
        ) {

            dispatch(
                getActiveBanners()
            );
        }

    }, [dispatch]);

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="w-full h-[100px] flex justify-center items-center text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    // ================= ERROR =================

    if (error) {
        return (
            <div className="w-full h-[100px] flex justify-center items-center text-red-500 text-xl">
                {typeof error ===
                    "string"
                    ? error
                    : error.message}
            </div>
        );
    }

    // ================= NO BANNERS =================

    if (
        !banners ||
        banners.length === 0
    ) {
        return null;
    }

    // ================= CURRENT BANNER =================

    const currentBanner =
        banners?.[index];

    if (!currentBanner) {
        return null;
    }

    return (

        <div className={`relative max-w-7xl mx-auto overflow-hidden ${className}`}>

            {/* IMAGE */}

            <img
                src={
                    currentBanner
                        ?.images?.[0]
                }
                alt={
                    currentBanner?.title
                }
                className={`w-full ${height} object-cover rounded-[24px]`}
            />

            {/* OVERLAY */}

            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-[#001b44]/90 via-[#001b44]/40 to-transparent" />

            {/* CONTENT */}

            <div className="absolute inset-0 flex items-center px-6 md:px-12">

                <div className="max-w-2xl">

                    {/* OFFER TAG */}

                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full mb-4">

                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

                        <span className="text-xs md:text-sm font-medium tracking-wide">
                            LIMITED PERIOD OFFER
                        </span>

                    </div>

                    {/* TITLE */}

                    <h1 className="text-white text-2xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">

                        {
                            currentBanner?.title
                        }

                    </h1>

                    {/* DESCRIPTION */}

                    {currentBanner?.description && (

                        <p className="mt-3 text-white/90 text-sm md:text-lg leading-relaxed max-w-xl line-clamp-2">

                            {
                                currentBanner?.description
                            }

                        </p>

                    )}

                    {/* BUTTON */}

                    {currentBanner?.link && (

                        <a
                            href={
                                currentBanner.link
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center mt-5 bg-white text-[#003580] px-6 py-2.5 rounded-xl text-sm md:text-base font-bold hover:scale-105 transition duration-300 shadow-lg"
                        >
                            Explore Now
                        </a>

                    )}

                </div>

            </div>

        </div>

    );
};

export default Banners;