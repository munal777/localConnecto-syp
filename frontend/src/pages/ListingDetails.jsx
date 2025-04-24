import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Tag, User, Info } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useUserProfile } from "../components/UserProfileContext";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profile } = useUserProfile();

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/items/${id}/`);
        setListing(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details");
        toast.error("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    // Fetch favorites from localStorage or API
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    if (id) {
      fetchListing();
    }
  }, [id]);

  // Handle error if listing not found or loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Loading...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Listing Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/listings">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Back to Listings
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Format the date (already formatted from API)
  const postedDate = listing.posted_date;

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((itemId) => itemId !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    const message = favorites.includes(id)
      ? "Removed from favorites"
      : "Added to favorites";
    toast.success(message);
  };

  const handleContactSeller = () => {
    toast.success("Contact request sent to seller!");
  };

  // Fix image URLs if needed
  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "";

    let imageUrl = imageObj.image;
    // If URL starts with 'image/upload/', handle it per your context pattern
    if (imageUrl.startsWith("image/upload/")) {
      return `https://res.cloudinary.com/dzetcdznm/${imageUrl}`;
    }
    return imageUrl;
  };

  // Get user profile image or display default
  const getUserProfileImage = () => {
    if (listing.user && listing.user.profile && listing.user.profile.image) {
      const image = listing.user.profile.image.replace("image/upload/", "");
      return image;
    }
    return null;
  };

  const getUserJoinData = () => {
    if (
      listing.user &&
      listing.user.profile &&
      listing.user.profile.created_at
    ) {
      return listing.user.profile.created_at;
    }
  };

  const getUserPhoneNumber = () => {
    if (
      listing.user &&
      listing.user.profile &&
      listing.user.profile.phone_number
    ) {
      return listing.user.profile.phone_number;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex text-sm font-medium">
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <Link
                  to="/listings"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Listings
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <Link
                  to={`/listings/category/${listing.category}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {listing.category_name}
                </Link>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none">
                  {listing.title} - {listing.condition}
                </span>
              </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Image Gallery */}
              <div className="lg:col-span-2 space-y-4">
                <div
                  className="relative rounded-lg overflow-hidden bg-gray-100"
                  style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
                >
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={getImageUrl(listing.images[activeImageIndex])}
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>

                {/* Thumbnails with consistent sizing */}
                {listing.images && listing.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto py-2">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                          index === activeImageIndex
                            ? "border-indigo-500"
                            : "border-transparent"
                        }`}
                        style={{
                          minWidth: "64px", // Ensures consistent width
                        }}
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={getImageUrl(image)}
                            alt={`${listing.title} thumbnail ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Listing Details */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900">Details</h2>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">
                          Condition
                        </h3>
                        <p className="text-gray-900 font-medium">
                          {listing.condition}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500">
                          Category
                        </h3>
                        <p className="text-gray-900 font-medium">
                          {listing.category_name}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">
                        Location
                      </h3>
                      <div className="flex items-center mt-1">
                        <MapPin size={16} className="text-gray-400 mr-1" />
                        <p className="text-gray-900">{listing.location}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="text-gray-700 mt-2 whitespace-pre-line">
                        {listing.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">
                        Posted
                      </h3>
                      <p className="text-gray-900">{postedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Listing Info & Seller */}
              <div className="space-y-6">
                {/* Listing Title & Price */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>

                    <div className="flex items-center mb-4">
                      <MapPin size={16} className="text-gray-400 mr-1" />
                      <span className="text-gray-600 text-sm">
                        {listing.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p
                        className={`text-2xl font-bold ${
                          listing.listing_type === "free"
                            ? "text-green-600"
                            : "text-indigo-600"
                        }`}
                      >
                        {listing.listing_type === "free"
                          ? "Free"
                          : `Rs ${listing.price}`}
                      </p>
                      <button
                        onClick={() => toggleFavorite(listing.id)}
                        className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${
                          favorites.includes(listing.id)
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                        aria-label={
                          favorites.includes(listing.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Seller Information
                    </h2>

                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                        {getUserProfileImage() ? (
                          <img
                            src={getUserProfileImage()}
                            alt={`${listing.first_name} ${listing.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                            <User size={24} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {listing.first_name} {listing.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Member since{" "}
                          {new Date(getUserJoinData()).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      {profile.id === listing.user.profile.id ? (
                        <div className="flex space-x-3 ">
                          <button
                            // onClick={handleContactSeller}
                            className="w-full px-4 py-2 bg-orange-500 text-white  rounded-md hover:bg-orange-600 transition-colors"
                          >
                            Item booked
                          </button>
                          <button
                            onClick={() => navigate(`/edit-listing/${listing.id}`)}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${getUserPhoneNumber()}`}
                          target="_blank"
                        >
                          <button
                            onClick={handleContactSeller}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Contact Seller
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <Info size={20} className="text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Safety Tips
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Meet in a safe, public place</li>
                          <li>• Don't share personal financial information</li>
                          <li>• Inspect the item before paying</li>
                          <li>• Report suspicious behavior</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetail;

