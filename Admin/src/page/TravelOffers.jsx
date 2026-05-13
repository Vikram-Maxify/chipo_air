// pages/admin/TravelOffers.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    createTravelOffer,
    deleteTravelOffer,
    getAllTravelOffers,
    updateTravelOffer,
} from "../reducer/slice/travelOfferSlice"

const TravelOffers = () => {
    const dispatch = useDispatch();

    const {
        offers,
        loading,
    } = useSelector(
        (state) => state.travelOffer
    );

    const [formData, setFormData] =
        useState({
            title: "",
            category: "",
            description: "",
            redirectUrl: "",
            validTill: "",
        });

    const [image, setImage] =
        useState(null);

    const [editId, setEditId] =
        useState(null);

    useEffect(() => {
        dispatch(
            getAllTravelOffers()
        );
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        const data =
            new FormData();

        data.append(
            "title",
            formData.title
        );

        data.append(
            "category",
            formData.category
        );

        data.append(
            "description",
            formData.description
        );

        data.append(
            "redirectUrl",
            formData.redirectUrl
        );

        data.append(
            "validTill",
            formData.validTill
        );

        if (image) {
            data.append(
                "image",
                image
            );
        }

        if (editId) {
            dispatch(
                updateTravelOffer({
                    id: editId,
                    updatedData:
                        data,
                })
            );
        } else {
            dispatch(
                createTravelOffer(
                    data
                )
            );
        }

        setFormData({
            title: "",
            category: "",
            description: "",
            redirectUrl: "",
            validTill: "",
        });

        setImage(null);
        setEditId(null);
    };

    const handleEdit = (offer) => {
        setEditId(offer._id);

        setFormData({
            title: offer.title,
            category:
                offer.category,
            description:
                offer.description,
            redirectUrl:
                offer.redirectUrl,
            validTill:
                offer.validTill?.split(
                    "T"
                )[0],
        });
    };

    const handleDelete = (
        id
    ) => {
        const confirmDelete =
            window.confirm(
                "Delete this offer?"
            );

        if (
            confirmDelete
        ) {
            dispatch(
                deleteTravelOffer(
                    id
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Travel Offers
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage travel
                        offers &
                        deals
                    </p>
                </div>

                {/* FORM */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-5">
                        {editId
                            ? "Update Offer"
                            : "Create Offer"}
                    </h2>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >

                        {/* TITLE */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter title"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* CATEGORY */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter category"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* REDIRECT URL */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Redirect URL
                            </label>

                            <input
                                type="text"
                                name="redirectUrl"
                                value={
                                    formData.redirectUrl
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        {/* VALID TILL */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Valid Till
                            </label>

                            <input
                                type="date"
                                name="validTill"
                                value={
                                    formData.validTill
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-medium">
                                Description
                            </label>

                            <textarea
                                rows="4"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter description"
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* IMAGE */}

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-medium">
                                Upload Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(
                                    e
                                ) =>
                                    setImage(
                                        e
                                            .target
                                            .files[0]
                                    )
                                }
                                className="w-full border rounded-xl px-4 py-3"
                            />
                        </div>

                        {/* BUTTON */}

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
                            >
                                {loading
                                    ? "Please wait..."
                                    : editId
                                        ? "Update Offer"
                                        : "Create Offer"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* OFFERS LIST */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers?.map(
                        (offer) => (
                            <div
                                key={
                                    offer._id
                                }
                                className="bg-white rounded-2xl overflow-hidden shadow-md"
                            >

                                {/* IMAGE */}

                                <img
                                    src={
                                        offer.image
                                    }
                                    alt={
                                        offer.title
                                    }
                                    className="w-full h-52 object-cover"
                                />

                                {/* CONTENT */}

                                <div className="p-5">
                                    <h2 className="text-xl font-bold mb-2">
                                        {
                                            offer.title
                                        }
                                    </h2>

                                    <span className="inline-block bg-black text-white text-sm px-3 py-1 rounded-full mb-3">
                                        {
                                            offer.category
                                        }
                                    </span>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {
                                            offer.description
                                        }
                                    </p>

                                    <div className="text-sm text-gray-500 mb-4">
                                        Valid Till:{" "}
                                        {offer.validTill
                                            ? new Date(
                                                offer.validTill
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    offer
                                                )
                                            }
                                            className="flex-1 bg-yellow-400 py-2 rounded-xl font-medium"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    offer._id
                                                )
                                            }
                                            className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelOffers;