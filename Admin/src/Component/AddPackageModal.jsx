import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPackage } from "../reducer/slice/packageSlice";
import { X, UploadCloud } from "lucide-react";

const AddPackageModal = ({ close }) => {
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        seoSlug: "",
    });

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreview(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        images.forEach((img) => {
            formData.append("images", img);
        });

        await dispatch(createPackage(formData));
        close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            {/* Modal */}
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 relative animate-fadeIn">

                {/* Close */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={18} />
                </button>

                {/* Heading */}
                <h2 className="text-2xl font-semibold mb-6">
                    Create New Package ✨
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="name"
                            placeholder="Package Name"
                            onChange={handleChange}
                            className="input-premium col-span-2"
                        />

                        <input
                            name="price"
                            placeholder="Price"
                            onChange={handleChange}
                            className="input-premium"
                        />

                        <input
                            name="duration"
                            placeholder="Duration"
                            onChange={handleChange}
                            className="input-premium"
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            onChange={handleChange}
                            className="input-premium col-span-2 h-24"
                        />

                    </div>

                    {/* SEO */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="metaTitle"
                            placeholder="Meta Title"
                            onChange={handleChange}
                            className="input-premium"
                        />

                        <input
                            name="seoSlug"
                            placeholder="SEO Slug"
                            onChange={handleChange}
                            className="input-premium"
                        />

                        <input
                            name="metaKeywords"
                            placeholder="Keywords"
                            onChange={handleChange}
                            className="input-premium col-span-2"
                        />

                        <textarea
                            name="metaDescription"
                            placeholder="Meta Description"
                            onChange={handleChange}
                            className="input-premium col-span-2 h-20"
                        />

                    </div>

                    {/* Upload */}
                    <label className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer block">
  
  <UploadCloud className="mx-auto mb-2 text-gray-500" />
  <p className="text-sm text-gray-500">
    Click to upload images (max 6)
  </p>

  <input
    type="file"
    multiple
    onChange={handleImage}
    className="hidden"
  />

</label>

                    {/* Preview */}
                    {preview.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto">
                            {preview.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                        >
                            Create Package
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddPackageModal;