import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPage, upsertPage } from "../reducer/slice/pageSlice";
import { Editor } from "@tinymce/tinymce-react";

const PrivacyPageEditor = () => {
    const dispatch = useDispatch();
    const { page, loading, error, success } = useSelector(
        (state) => state.page
    );

    const [form, setForm] = useState({
        title: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
    });

    // LOAD PAGE
    useEffect(() => {
        dispatch(getPage("privacy"));
    }, [dispatch]);

    // SET DATA
    useEffect(() => {
        if (page) {
            setForm({
                title: page.title || "",
                content: page.content || "",
                metaTitle: page.metaTitle || "",
                metaDescription: page.metaDescription || "",
                metaKeywords: page.metaKeywords?.join(", ") || "",
            });
        }
    }, [page]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 TinyMCE change
    const handleEditorChange = (content) => {
        setForm((prev) => ({
            ...prev,
            content: content,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("type", "privacy");

        Object.keys(form).forEach((key) => {
            if (form[key]) formData.append(key, form[key]);
        });

        dispatch(upsertPage(formData));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-semibold mb-6">
                    Edit Privacy Policy
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* TITLE */}
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full border rounded-lg p-2"
                    />

                    {/* 🔥 TINYMCE EDITOR */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Privacy Content
                        </label>

                        <Editor
                            apiKey="23f7g88ne3bk2arnfngone4m3iyhlphse03oos0kz4p1l4lt"
                            value={form.content}
                            init={{
                                height: 400,
                                menubar: true,

                                plugins: [
                                    "advlist autolink lists link image charmap preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table code help wordcount",
                                ],

                                toolbar:
                                    "undo redo | formatselect | " +
                                    "bold italic underline | forecolor backcolor | " +
                                    "alignleft aligncenter alignright alignjustify | " +
                                    "bullist numlist outdent indent | " +
                                    "fontsizeselect | code",

                                fontsize_formats:
                                    "8pt 10pt 12pt 14pt 18pt 24pt 36pt",

                                content_style:
                                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>

                    {/* SEO */}
                    <div className="border-t pt-4">
                        <h2 className="font-medium mb-2">SEO</h2>

                        <input
                            type="text"
                            name="metaTitle"
                            value={form.metaTitle}
                            onChange={handleChange}
                            placeholder="Meta Title"
                            className="w-full border p-2 rounded-lg mb-2"
                        />

                        <textarea
                            name="metaDescription"
                            value={form.metaDescription}
                            onChange={handleChange}
                            placeholder="Meta Description"
                            className="w-full border p-2 rounded-lg mb-2"
                        />

                        <input
                            type="text"
                            name="metaKeywords"
                            value={form.metaKeywords}
                            onChange={handleChange}
                            placeholder="keyword1, keyword2"
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg"
                    >
                        {loading ? "Saving..." : "Save Privacy Page"}
                    </button>

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-600">Saved ✅</p>}
                </form>
            </div>
        </div>
    );
};

export default PrivacyPageEditor;