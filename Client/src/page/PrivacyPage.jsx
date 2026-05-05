import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getPage } from "../reducer/slice/pageSlice";
import { Helmet } from "react-helmet-async";
import { 
  Shield, 
  ArrowLeft, 
  Clock,
  FileText,
  AlertCircle
} from "lucide-react";

const PrivacyPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { page, loading, error } = useSelector((state) => state.page);

  const pageSlug = slug || "privacy";

  useEffect(() => {
    dispatch(getPage(pageSlug));
    window.scrollTo(0, 0);
  }, [dispatch, pageSlug]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load page
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getPage(pageSlug))}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Page not found
          </h2>
          <p className="text-gray-500 mb-6">
            The page you're looking for doesn't exist
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const lastUpdated = page.updatedAt 
    ? new Date(page.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* SEO META TAGS - Preserved exactly from backend */}
      <Helmet>
        <title>{page?.metaTitle || page?.title || "Privacy Policy"}</title>
        <meta name="description" content={page?.metaDescription} />
        <meta name="keywords" content={page?.metaKeywords?.join(", ")} />
      </Helmet>

      {/* Header Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {page?.title || "Privacy Policy"}
              </h1>
              
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content - Preserved HTML from backend */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
          <div
            className="prose prose-sm sm:prose-base max-w-none
              prose-headings:text-gray-900 
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:text-gray-700
              prose-ol:text-gray-700
              prose-li:my-1
              prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
              [&_table]:w-full [&_table]:border-collapse
              [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:border [&_th]:border-gray-200
              [&_td]:p-3 [&_td]:text-sm [&_td]:border [&_td]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: page?.content }}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm mb-1">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-blue-800">
                We are committed to protecting your personal information and 
                ensuring transparency in how we collect and use your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;