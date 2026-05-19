// pages/Banners.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    getActiveBanners,
} from "../reducer/slice/userBannerSlice";

const Banners = () => {

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

    console.log(banners);
    

    const [currentIndex,
        setCurrentIndex] =
        useState(0);

    // ================= FETCH BANNERS =================

    useEffect(() => {

        dispatch(
            getActiveBanners()
        );

    }, [dispatch]);

    // ================= AUTO SLIDER =================

    useEffect(() => {

        if (
            banners?.length >
            1
        ) {

            const interval =
                setInterval(() => {

                    setCurrentIndex(
                        (
                            prev
                        ) =>
                            prev ===
                                banners.length -
                                1
                                ? 0
                                : prev +
                                1
                    );

                }, 5000);

            return () =>
                clearInterval(
                    interval
                );
        }

    }, [banners]);

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
        banners[
        currentIndex
        ];

    // ================= NEXT =================

    const nextSlide =
        () => {

            setCurrentIndex(
                (
                    prev
                ) =>
                    prev ===
                        banners.length -
                        1
                        ? 0
                        : prev + 1
            );

        };

    // ================= PREVIOUS =================

    const prevSlide =
        () => {

            setCurrentIndex(
                (
                    prev
                ) =>
                    prev === 0
                        ? banners.length -
                        1
                        : prev - 1
            );

        };

    return (
        <div className="relative w-full overflow-hidden py-4 mb-5">

    {/* IMAGE */}

    <img
        src={
            currentBanner
                ?.images?.[0]
        }
        alt={
            currentBanner?.title
        }
        className="w-full h-[220px] md:h-[220px] object-cover rounded-[24px] transition-all duration-700"
    />

    {/* OVERLAY */}

    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-[#001b44]/90 via-[#001b44]/40 to-transparent" />

    {/* CONTENT */}

    <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">

        {/* LEFT CONTENT */}

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

        {/* RIGHT OFFER CARD */}
{/* 
        <div className="hidden md:flex flex-col bg-white rounded-2xl shadow-2xl px-6 py-5 min-w-[230px]">

            <span className="text-sm font-medium text-gray-500 mb-1">
                Starting From
            </span>

            <h2 className="text-4xl font-extrabold text-[#003580]">
                50%
            </h2>

            <p className="text-gray-600 text-sm mt-1">
                OFF on Flights &
                Hotels
            </p>

            <div className="mt-4 bg-[#003580] text-white text-center py-2 rounded-xl font-semibold text-sm">
                Book Today
            </div>
        </div> */}
    </div>

    {/* PREV BUTTON */}

    {banners.length >
        1 && (

        <button
            onClick={
                prevSlide
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg w-10 h-10 rounded-full flex items-center justify-center text-white transition duration-300"
        >

            <ChevronLeft
                size={
                    22
                }
            />

        </button>

    )}

    {/* NEXT BUTTON */}

    {banners.length >
        1 && (

        <button
            onClick={
                nextSlide
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg w-10 h-10 rounded-full flex items-center justify-center text-white transition duration-300"
        >

            <ChevronRight
                size={
                    22
                }
            />

        </button>

    )}

    {/* DOTS */}

    {banners?.length >
        1 && (

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">

            {banners?.map(
                (_,index) => (

                    <button
                        key={
                            index
                        }
                        onClick={() =>
                            setCurrentIndex(
                                index
                            )
                        }
                        className={`transition-all duration-300 rounded-full ${
                            currentIndex ===
                            index
                                ? "w-7 h-2 bg-white"
                                : "w-2 h-2 bg-white/50"
                        }`}
                    />

                )
            )}

        </div>

    )}
</div>
    );
};

export default Banners;