// pages/Banners.jsx

import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

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

    // ================= FETCH BANNER =================

    useEffect(() => {

        dispatch(
            getActiveBanners()
        );

    }, [dispatch]);

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="w-full h-[500px] flex justify-center items-center text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    // ================= ERROR =================

    if (error) {
        return (
            <div className="w-full h-[500px] flex justify-center items-center text-red-500 text-xl">
                {typeof error ===
                "string"
                    ? error
                    : error.message}
            </div>
        );
    }

    // ================= FIRST BANNER =================

    const banner =
        banners?.[0];

    // ================= NO BANNER =================

    if (!banner) {
        return null;
    }

    return (
        <div className="w-full relative overflow-hidden">

            {/* IMAGE */}

            <img
                src={
                    banner
                        .images?.[0]
                }
                alt={
                    banner.title
                }
                className="w-full h-[100px] md:h-[150px] object-cover"
            />

            {/* OVERLAY */}

            <div className="absolute inset-0 bg-black/20" />

            {/* TITLE */}

            <div className="absolute bottom-10 left-10 md:left-20">

                <h1 className="text-white text-4xl md:text-3xl font-bold max-w-4xl leading-tight drop-shadow-lg">
                    {
                        banner.title
                    }
                </h1>

            </div>
        </div>
    );
};

export default Banners;