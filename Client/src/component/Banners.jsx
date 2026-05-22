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

  <div className={`max-w-7xl px-3 md:px-0 mx-auto ${className}`}>

    {currentBanner?.link ? (

      <a
        href={
          currentBanner.link
        }
        target="_blank"
        rel="noreferrer"
        className="block group overflow-hidden rounded-[24px]"
      >

        <img
          src={
            currentBanner
              ?.images?.[0]
          }
          alt="banner"
          className={`w-full ${height} object-cover rounded-[24px] transition-all duration-500 group-hover:scale-[1.02]`}
        />

      </a>

    ) : (

      <div className="overflow-hidden rounded-[24px]">

        <img
          src={
            currentBanner
              ?.images?.[0]
          }
          alt="banner"
          className={`w-full ${height} object-cover rounded-[24px]`}
        />

      </div>

    )}

  </div>

);
};

export default Banners;