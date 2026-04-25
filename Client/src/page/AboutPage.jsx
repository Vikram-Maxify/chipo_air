import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPage } from "../reducer/slice/pageSlice";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { page, loading, error } = useSelector((state) => state.page);

  useEffect(() => {
    dispatch(getPage("about"));
  }, [dispatch]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white min-h-screen">
      
      {/* ✅ SEO META TAGS */}
      <Helmet>
        <title>{page?.metaTitle || page?.title}</title>
        <meta name="description" content={page?.metaDescription} />
        <meta
          name="keywords"
          content={page?.metaKeywords?.join(", ")}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-10">
        
        <h1 className="text-3xl font-bold mb-6">
          {page?.title || "About Us"}
        </h1>

        {page?.image && (
          <img
            src={page.image}
            alt="about"
            className="w-full rounded-xl mb-6"
          />
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page?.content }}
        />
      </div>
    </div>
  );
};

export default AboutPage;