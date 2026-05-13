// pages/admin/Banners.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    createBanner,
    deleteBanner,
    getAllBannersAdmin,
    updateBanner,
} from "../reducer/slice/bannerSlice";

import {
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";

const AdminBanners = () => {

    const dispatch =
        useDispatch();

    const {
        banners,
        loading,
    } = useSelector(
        (state) =>
            state.banner
    );

    const [editId,
        setEditId] =
        useState(null);

    const [formData,
        setFormData] =
        useState({
            title: "",
            description:
                "",
            link: "",
            isActive: true,
        });

    const [images,
        setImages] =
        useState([]);

    // ================= FETCH BANNERS =================

    useEffect(() => {
        dispatch(
            getAllBannersAdmin()
        );
    }, [dispatch]);

    // ================= HANDLE CHANGE =================

    const handleChange = (
        e
    ) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData({
            ...formData,
            [name]:
                type ===
                "checkbox"
                    ? checked
                    : value,
        });
    };

    // ================= HANDLE IMAGES =================

    const handleImages = (
        e
    ) => {
        setImages(
            [
                ...e.target
                    .files,
            ]
        );
    };

    // ================= SUBMIT =================

    const handleSubmit =
        async (
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
                "description",
                formData.description
            );

            data.append(
                "link",
                formData.link
            );

            data.append(
                "isActive",
                formData.isActive
            );

            images.forEach(
                (
                    image
                ) => {
                    data.append(
                        "images",
                        image
                    );
                }
            );

            if (
                editId
            ) {
                dispatch(
                    updateBanner(
                        {
                            id: editId,
                            formData:
                                data,
                        }
                    )
                );
            } else {
                dispatch(
                    createBanner(
                        data
                    )
                );
            }

            // RESET

            setEditId(
                null
            );

            setFormData(
                {
                    title:
                        "",
                    description:
                        "",
                    link: "",
                    isActive: true,
                }
            );

            setImages(
                []
            );
        };

    // ================= EDIT =================

    const handleEdit = (
        banner
    ) => {
        setEditId(
            banner._id
        );

        setFormData({
            title:
                banner.title,
            description:
                banner.description,
            link: banner.link,
            isActive:
                banner.isActive,
        });
    };

    // ================= DELETE =================

    const handleDelete = (
        id
    ) => {
        const confirmDelete =
            window.confirm(
                "Delete this banner?"
            );

        if (
            confirmDelete
        ) {
            dispatch(
                deleteBanner(
                    id
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-6">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-[#1f1f1f]">
                            Banner
                            Management
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Create
                            and manage
                            homepage
                            banners
                        </p>
                    </div>

                    <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl font-medium">
                        <Plus
                            size={
                                20
                            }
                        />

                        Add Banner
                    </button>
                </div>

                {/* FORM */}

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-10">

                    <h2 className="text-2xl font-bold mb-6">
                        {editId
                            ? "Update Banner"
                            : "Create Banner"}
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
                                placeholder="Enter banner title"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>

                        {/* LINK */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Redirect
                                Link
                            </label>

                            <input
                                type="text"
                                name="link"
                                value={
                                    formData.link
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
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
                                placeholder="Enter banner description"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        {/* IMAGES */}

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-medium">
                                Upload
                                Images
                                (Max 6)
                            </label>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={
                                    handleImages
                                }
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                            />
                        </div>

                        {/* ACTIVE */}

                        <div className="md:col-span-2 flex items-center gap-3">

                            <input
                                type="checkbox"
                                name="isActive"
                                checked={
                                    formData.isActive
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-5 h-5"
                            />

                            <label className="font-medium">
                                Active
                                Banner
                            </label>
                        </div>

                        {/* BUTTON */}

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition"
                            >
                                {loading
                                    ? "Please wait..."
                                    : editId
                                    ? "Update Banner"
                                    : "Create Banner"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* BANNERS LIST */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

                    {banners &&
                    banners.length >
                        0 ? (
                        banners.map(
                            (
                                banner
                            ) => (
                                <div
                                    key={
                                        banner._id
                                    }
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200"
                                >

                                    {/* IMAGE */}

                                    <img
                                        src={
                                            banner
                                                .images?.[0]
                                        }
                                        alt={
                                            banner.title
                                        }
                                        className="w-full h-64 object-cover"
                                    />

                                    {/* CONTENT */}

                                    <div className="p-5">

                                        <div className="flex justify-between items-start mb-3">

                                            <h2 className="text-2xl font-bold line-clamp-2">
                                                {
                                                    banner.title
                                                }
                                            </h2>

                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                    banner.isActive
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {banner.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                                            {
                                                banner.description
                                            }
                                        </p>

                                        {/* ACTIONS */}

                                        <div className="flex items-center gap-3">

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        banner
                                                    )
                                                }
                                                className="flex-1 flex justify-center items-center gap-2 bg-yellow-400 py-3 rounded-2xl font-medium"
                                            >
                                                <Pencil
                                                    size={
                                                        18
                                                    }
                                                />

                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        banner._id
                                                    )
                                                }
                                                className="flex-1 flex justify-center items-center gap-2 bg-red-500 text-white py-3 rounded-2xl font-medium"
                                            >
                                                <Trash2
                                                    size={
                                                        18
                                                    }
                                                />

                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <div className="col-span-full flex justify-center items-center py-20">
                            <h2 className="text-2xl text-gray-500">
                                No
                                Banners
                                Found
                            </h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBanners;