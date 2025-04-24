import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Image, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api";

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

const CreateListing = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [condition, setCondition] = useState("");
  const [listingType, setListingType] = useState("sell"); // 'sell' or 'free'
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    images: "",
    price: ""
  });

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      category: "",
      condition: "",
      location: "",
      images: "",
      price: ""
    };

    if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
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

    if (imageFiles.length === 0) {
      newErrors.images = "Please add at least one image";
      isValid = false;
    }

    if (listingType === "sell" && (!price || parseFloat(price) <= 0)) {
      newErrors.price = "Price must be greater than zero for items for sale";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object to send files
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryId);
      formData.append("listing_type", listingType);
      formData.append("location", location);
      formData.append("status", "available");
      formData.append("condition", condition);

      // Only append price if it's not a free listing
      if (listingType === "sell") {
        formData.append("price", price);
      }

      // Append each image file
      imageFiles.forEach((file) => {
        formData.append("uploaded_images", file);
      });

      // Send data to the API
      await api.post("/items/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Listing created successfully!");

      // Redirect to listings page
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    } catch (error) {
      console.error("Error creating listing:", error);

      // Handle validation errors from backend
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const updatedErrors = { ...errors };

        // Map backend errors to form fields
        Object.keys(backendErrors).forEach((key) => {
          if (key === "uploaded_images") {
            updatedErrors.images = backendErrors[key][0];
          } else if (key in updatedErrors) {
            updatedErrors[key] = backendErrors[key][0];
          }
        });

        setErrors(updatedErrors);
      } else {
        toast.error("Failed to create listing. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate files (max 3 as per your API)
    if (imageFiles.length + files.length > 3) {
      setErrors({ ...errors, images: "Maximum 3 images allowed" });
      return;
    }

    // Check each file size (max 2MB as per your API)
    const oversizedFiles = files.filter((file) => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors({ ...errors, images: "Image size cannot exceed 2MB" });
      return;
    }

    // Create preview URLs for selected images
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Generate preview URLs
    const newPreviewUrls = [...imagePreviewUrls];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result);
        setImagePreviewUrls([...newPreviewUrls]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the error if we've added an image
    if (errors.images && imageFiles.length === 0) {
      setErrors({ ...errors, images: "" });
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviewUrls = [...imagePreviewUrls];

    newImageFiles.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setImageFiles(newImageFiles);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  // Toggle between free and priced item
  const toggleListingType = () => {
    setListingType(listingType === "sell" ? "free" : "sell");
    if (listingType === "sell") {
      setPrice("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-14 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/listings"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back to Listings</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Create New Listing
            </h1>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Listing Details
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Provide information about the item you want to list.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      A clear title will help people find your item.
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
                      placeholder="Describe your item in detail..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Include condition, features, and reason for selling.
                    </p>
                  </div>

                  {/* Category */}
                  <div className="flex space-x-4 w-full">
                  <div className="flex-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
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
                  <div className="flex-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>
                        Select condition
                      </option>
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

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Brooklyn, NY"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your neighborhood or area for local pickup.
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Images</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Add up to 3 images of your item. The first image will be
                        the cover.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {imagePreviewUrls.map((previewUrl, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                          >
                            <img
                              src={previewUrl}
                              alt={`Listing image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}

                        {imageFiles.length < 3 && (
                          <label className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 hover:border-indigo-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Image className="h-6 w-6 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Add Image
                            </span>
                          </label>
                        )}
                      </div>

                      {errors.images && (
                        <p className="text-sm text-red-600">{errors.images}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate("/listings")}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isLoading
                          ? "bg-indigo-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Listing"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateListing;
