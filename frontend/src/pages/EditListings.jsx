import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Tag,
  Save,
  UploadCloud,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api";

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form fields
  const [listingData, setListingData] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingType, setListingType] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState();
  const [categories, setCategories] = useState([]);
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const categoriesresponse = await api.get("/categories/");
        setCategories(categoriesresponse.data);

        if (id) {
          const response = await api.get(`/items/${id}/`);
          setListingData(response.data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load Data");
        navigate('/listings');
      }
    };

    fetchData();
  }, [id]);

  // Initialize form with listing data
  useEffect(() => {
    if (listingData) {

      setTitle(listingData.title);
      setDescription(listingData.description);

      if (listingData.listing_type === "free") {
        setListingType("free");
      } else {
        setListingType("sell");
        setPrice(listingData.price)
      }

      setCategoryId(listingData.category);
      setCondition(listingData.condition);
      setLocation(listingData.location);
      setImages(listingData.images);
    }
  }, [listingData, navigate]);


  const getImageURL = (imageObj) => {
    if (!imageObj || !imageObj.image) return '';

    let imageUrl = imageObj.image;
    if (imageUrl.startsWith('image/upload/')) {
      return `https://res.cloudinary.com/dzetcdznm/${imageUrl}`;
    }
    return imageUrl
  }

  // Handle new image file selection
  const handleImageChange = (e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList);
      setNewImages((prev) => [...prev, ...filesArray]);

      // Create preview URLs for new images
      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Handle removing an existing image
  const removeExistingImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle removing a new image
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    // Also remove the preview URL and revoke the object URL to free memory
    const urlToRemove = previewUrls[index];
    URL.revokeObjectURL(urlToRemove);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Save images changes
  const handleSaveImages = () => {
    // In a real app, you would upload the new images to a server/storage
    toast.success("Images updated successfully!");

    // Clear new images after successful upload
    // In a real app, you would get the URLs from the server and add them to the images array
    setNewImages([]);

    // Add preview URLs to images array (simulating server response)
    setImages((prev) => [...prev, ...previewUrls]);
    setPreviewUrls([]);
  };


  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    price: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      category: "",
      condition: "",
      location: "",
      price: ""
    };

    if (title.length < 5 || title.length > 100) {
      newErrors.title = "Title must be at least 5-100 characters";
      isValid = false;
    }

    if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
      isValid = false;
    }

    if (!categoryId) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!condition) {
      newErrors.condition = "Condition is required";
      isValid = false;
    }

    if (location.length < 3) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (listingType === "sell" && (!price || parseFloat(price) <= 0)) {
      newErrors.price = "Price must be greater than zero for items for sale";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Update FormData object to send files
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryId);
      formData.append("listing_type", listingType);
      formData.append("location", location);
      formData.append("condition", condition);

      // Only append price if it's not a free listing
      if (listingType === "sell") {
        formData.append("price", price);
      } else {
        formData.append("price", "");
      }

       // Send data to the API
       await api.put(`/items/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Listing updated successfully!");

      // Redirect to listings page
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  }

  // Toggle between free and priced item
  const toggleListingType = () => {
    setListingType(listingType === "sell" ? "free" : "sell");
    if (listingType === "sell") {
      setPrice(price);
    }
  };

  if (!listingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/listings/${id}`)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Edit Listing</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Images Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Listing Images
              </h2>
              {(newImages.length > 0 ||
                images.length !== listingData.images.length) && (
                <button
                  onClick={handleSaveImages}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Save Images
                </button>
              )}
            </div>

            {/* Current Images */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Current Images
              </p>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
                    >
                      <img
                        src={getImageURL(image)}
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No images available
                </p>
              )}
            </div>

            {/* New Images */}
            {newImages.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  New Images
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
                    >
                      <img
                        src={url}
                        alt={`New image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-2 py-1 bg-indigo-600 text-xs font-medium rounded">
                          New
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div>
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <UploadCloud size={16} className="mr-2 text-gray-500" />
                Add Images
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="mt-2 text-xs text-gray-500">
                You can upload multiple images. Max 5MB per image.
              </p>
            </div>
          </div>

          {/* Listing Details Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Listing Details
              </h2>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={100}
                />
                {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                <p className="mt-1 text-xs text-gray-500">
                  {100 - title.length} characters remaining
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item, include condition, features, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
              </div>

              {/* Price */}
              <div>
                    <div className="flex items-center mb-4">
                      <button
                        type="button"
                        onClick={toggleListingType}
                        className={`relative inline-flex h-6 w-11 mr-3 items-center rounded-full transition-colors ${
                          listingType === "free"
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`${
                            listingType === "free"
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block h-4 w-4 rounded-full bg-white transition-transform`}
                        />
                      </button>
                      <span className="font-medium text-sm">
                        This item is free
                      </span>
                    </div>

                    {listingType === "sell" && (
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Price (Rs)
                        </label>
                        <input
                          id="price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Enter price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.price}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

              {/* Category & Condition - side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category}
                      </p>
                    )}
                </div>

                {/* Condition */}
                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Condition
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.condition}
                      </p>
                    )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  // onClick={() => navigate(`/item/${id}`)}  -commmented just for commit
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  <Save size={16} className="mr-2" />
                  Save Details
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditListing;
