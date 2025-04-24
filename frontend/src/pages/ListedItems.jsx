import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  Plus,
  Heart,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("listing_type") || "all";

  const [viewMode, setViewMode] = useState("grid");
  const [listingType, setListingType] = useState(initialListingType);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6; 

  // Fetch listings and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch listings with pagination
        const listingsResponse = await api.get(`/items/?page=${currentPage}`);
        const paginatedData = listingsResponse.data;
        
        // Update pagination state
        setTotalItems(paginatedData.count);
        
        // Get the actual listings from the results array
        const listingData = paginatedData.results;
        setAllListings(listingData);
        setFilteredListings(listingData); // Initialize filtered listings with all listings

        
        const uniqueLocations = [
          ...new Set(listingData.map((item) => item.location)),
        ];
        setLocations(uniqueLocations);


        if (categories.length <= 1) {
          const categoriesResponse = await api.get("/categories/");
          setCategories([
            "all",
            ...categoriesResponse.data.map((cat) => cat.name.toLowerCase()),
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load listings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); 

  // Apply filters
  useEffect(() => {
    if (allListings.length === 0) return;

    let filtered = [...allListings];

    // Filter by listing type
    if (listingType !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.listing_type === (listingType === "buy" ? "sell" : listingType)
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (item) => item.category_name.toLowerCase() === category
      );
    }

    // Filter by location
    if (locationSearch) {
      filtered = filtered.filter((item) =>
        item.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
      default:
        // Sort by posted_date (most recent first)
        filtered.sort(
          (a, b) => new Date(b.posted_date) - new Date(a.posted_date)
        );
        break;
    }

    setFilteredListings(filtered);
  }, [allListings, listingType, category, locationSearch, sortBy, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [listingType, category, locationSearch, searchTerm]);

  // Update listing type when URL param changes
  useEffect(() => {
    setListingType(initialListingType);
  }, [initialListingType]);

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // The data fetching will happen in the first useEffect
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  // Get the appropriate image URL
  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) {
      // Cloudinary URL format
      return `https://res.cloudinary.com/dzetcdznm/${listing.images[0].image}`;
    }
    return "https://images.unsplash.com/photo-1592078615290-033ee584dd43?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80"; // Fallback image
  };

  // Format the price display
  const formatPrice = (listing) => {
    if (listing.listing_type === "free") {
      return "Free";
    }
    return listing.price ? `Rs ${listing.price}` : "Free";
  };

  // Calculate if we should show pagination
  const shouldShowPagination = totalItems > itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Determine if we should show no results message
  const showNoResults = !isLoading && filteredListings.length === 0;

  return (
    <div className="min-h-screen pt-2 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-up">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Listings
            </h1>
            <p className="text-gray-600">
              Find items for free or to buy in your local area
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/listings/new"
              className="bg-indigo-700 text-white py-2 px-3 rounded-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Create Listing</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Item Search */}
            <div className="relative flex-grow w-3/5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Location Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search by location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                list="locations-list"
              />
              <datalist id="locations-list">
                {locations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            <button
              className="md:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2 text-gray-500" />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label
                  htmlFor="listing-type-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Listing Type
                </label>
                <select
                  id="listing-type-filter"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-3 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                >
                  <option value="all">All Listings</option>
                  <option value="free">Free Items</option>
                  <option value="buy">Items to Buy</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category-filter"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-3 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <select
                  id="sort-filter"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-3 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-gray-200 rounded col-span-1"></div>
                      <div className="h-32 bg-gray-200 rounded col-span-1"></div>
                      <div className="h-32 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-4">Loading listings...</p>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {showNoResults && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any listings matching your search criteria.
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={() => {
                  setListingType("all");
                  setCategory("all");
                  setSortBy("newest");
                  setSearchTerm("");
                  setLocationSearch("");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Listings */}
        {!isLoading && filteredListings.length > 0 && (
          <div className="animate-fade-up">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listings/${listing.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
                      <div className="relative h-56 bg-gray-200">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={getImageUrl(listing)}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">
                              No image available
                            </span>
                          </div>
                        )}
                        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">
                              {formatPrice(listing)}
                            </span>
                            <span className="text-white text-sm flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />{" "}
                              {listing.location}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full border border-indigo-100 bg-indigo-50/80 backdrop-blur-sm text-indigo-700">
                            {listing.category_name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {listing.description}
                        </p>
                      </div>
                      <div className="px-4 pb-4 flex justify-between">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-indigo-600 mr-1" />
                          <span className="text-xs font-medium text-indigo-600">
                            {listing.listing_type === "free"
                              ? "Free Item"
                              : "For Sale"}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-indigo-600 capitalize flex items-center">
                          <span>{listing.posted_date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listings/${listing.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 md:w-64 h-48 sm:h-auto bg-gray-200 flex-shrink-0">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={getImageUrl(listing)}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">
                              No image available
                            </span>
                          </div>
                        )}
                        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 sm:hidden bg-gradient-to-t from-black/60 to-transparent p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">
                              {formatPrice(listing)}
                            </span>
                            <span className="text-white text-sm flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />{" "}
                              {listing.location}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full border border-indigo-100 bg-indigo-50/80 backdrop-blur-sm text-indigo-700">
                            {listing.category_name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                              {listing.title}
                            </h3>
                            <span className="text-lg font-semibold text-indigo-600 hidden sm:block">
                              {formatPrice(listing)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {listing.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-indigo-600 mr-1" />
                            <span className="text-xs font-medium text-indigo-600">
                              {listing.listing_type === "free"
                                ? "Free Item"
                                : "For Sale"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 flex items-center hidden sm:flex">
                            <MapPin className="w-4 h-4 mr-1" />{" "}
                            {listing.location}
                          </span>
                          <div className="text-xs font-medium text-indigo-600">
                            <span>Posted: {listing.posted_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {shouldShowPagination && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Don't render if there's only one page
  if (totalPages <= 1) return null;
  
  // For better UX, limit the number of page buttons shown
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;
    
    if (totalPages <= 5) {
      // Less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 5 total pages, calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    
    // Add the page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => onPageChange(i)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
              currentPage === i
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </button>
        </li>
      );
    }
    
    return pageNumbers;
  };

  return (
    <nav aria-label="Pagination" className="mt-8">
      <ul className="flex items-center justify-center gap-2 py-6">
        {/* Previous page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 ${
              currentPage === 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            &lt;
          </button>
        </li>
        
        {/* First page */}
        {totalPages > 5 && currentPage > 3 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                1
              </button>
            </li>
            {currentPage > 4 && (
              <li className="px-2">...</li>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {renderPageNumbers()}
        
        {/* Last page */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <li className="px-2">...</li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        {/* Next page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 ${
              currentPage === totalPages 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Listings;