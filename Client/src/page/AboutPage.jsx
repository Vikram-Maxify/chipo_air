import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getPage } from "../reducer/slice/pageSlice";
import { Helmet } from "react-helmet-async";
import { 
  ArrowLeft, 
  Users,
  Clock,
  FileText,
  AlertCircle,
  Plane,
  Star,
  Globe,
  Award
} from "lucide-react";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { page, loading, error } = useSelector((state) => state.page);

  const pageSlug = slug || "about";

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

  const stats = [
    { icon: Users, value: "10M+", label: "Happy Travellers" },
    { icon: Plane, value: "500+", label: "Airlines" },
    { icon: Globe, value: "100+", label: "Countries" },
    { icon: Star, value: "4.8", label: "Rating" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* SEO META TAGS - Preserved exactly from backend */}
      <Helmet>
        <title>{page?.metaTitle || page?.title || "About Us"}</title>
        <meta name="description" content={page?.metaDescription} />
        <meta name="keywords" content={page?.metaKeywords?.join(", ")} />
      </Helmet>

      {/* Header Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Hero Image Section */}
        {page?.image && (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-48 sm:h-64 md:h-80 lg:h-96">
            <img
              src={page.image}
              alt={page?.title || "About Us"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-blue-200 font-medium">
                  About FlightBooker
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {page?.title || "About Us"}
              </h1>
            </div>
          </div>
        )}

        {/* Title without image */}
        {!page?.image && (
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {page?.title || "About Us"}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 text-center">
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2 md:mb-3" />
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
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
              prose-img:rounded-xl prose-img:shadow-md
              [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
              [&_table]:w-full [&_table]:border-collapse
              [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:border [&_th]:border-gray-200
              [&_td]:p-3 [&_td]:text-sm [&_td]:border [&_td]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: page?.content }}
          />
        </div>

        {/* Mission Statement */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Plane className="w-8 h-8 md:w-10 md:h-10 transform -rotate-45" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Our Mission
              </h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                To make travel accessible, affordable, and enjoyable for everyone. 
                We're committed to providing the best booking experience with 
                transparent pricing and exceptional customer service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;