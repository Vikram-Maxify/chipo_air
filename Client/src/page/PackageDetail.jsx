import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSinglePackage } from "../reducer/slice/packageSlice";
import { Helmet } from "react-helmet-async";
import { Clock } from "lucide-react";

const PackageDetail = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();

    const { singlePackage, loading, error } = useSelector(
        (state) => state.package
    );

    // =========================
    // FETCH SINGLE PACKAGE
    // =========================
    useEffect(() => {
        if (slug) {
            dispatch(getSinglePackage(slug));
        }
    }, [dispatch, slug]);

    // =========================
    // LOADING / ERROR
    // =========================
    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    if (!singlePackage) {
        return <div className="p-6 text-center">No package found</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* =========================
          SEO (DYNAMIC - SLUG BASED)
      ========================= */}
            <Helmet>
                <title>
                    {singlePackage.metaTitle || singlePackage.name}
                </title>

                <meta
                    name="description"
                    content={singlePackage.metaDescription}
                />

                <meta
                    name="keywords"
                    content={singlePackage.metaKeywords?.join(", ")}
                />

                {/* Open Graph */}
                <meta property="og:title" content={singlePackage.metaTitle} />
                <meta
                    property="og:description"
                    content={singlePackage.metaDescription}
                />
                <meta
                    property="og:image"
                    content={singlePackage.images?.[0]}
                />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* =========================
          CONTENT
      ========================= */}
            <div className="max-w-5xl mx-auto px-4 py-10">

                {/* TITLE */}
                <h1 className="text-3xl font-bold mb-4">
                    {singlePackage.name}
                </h1>

                {/* IMAGE */}
                <img
                    src={singlePackage.images?.[0]}
                    alt={singlePackage.name}
                    className="w-full h-[400px] object-cover rounded-xl mb-6"
                />

                {/* DETAILS */}
                <div className="space-y-4">

                    {/* DESCRIPTION */}
                    <p className="text-gray-700 text-lg">
                        {singlePackage.description}
                    </p>

                    {/* DURATION */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={18} />
                        {singlePackage.duration}
                    </div>

                    {/* PRICE */}
                    <div className="text-2xl font-semibold text-blue-600">
                        ₹{singlePackage.price}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PackageDetail;