import {
  ArrowRight,
  Gift,
  Heart,
  Map,
  Tag,
  ShoppingBag,
  Users,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { userAuthentication } from "../auth/auth";

function Home() {
  const { isAuthorized } = userAuthentication();

  return (
    <div className="flex flex-col border-t-1 border-gray-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-indigo-700">
                  Connect with your{" "}
                  <span className="text-black">local community</span>
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Buy, sell, or give away items in your local area.
                  LocalConnecto brings communities together through a simple,
                  location-based marketplace.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/listings">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                    Explore Listings <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                {!isAuthorized && (
                  <Link to="/signup">
                    <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md">
                      Sign Up Free
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
                <img
                  src="/src/assets/share.jpg"
                  alt="LocalConnecto marketplace"
                  className="object-cover rounded-xl  w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              LocalConnecto makes exchanging goods in your community simple,
              safe, and social.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm card-hover">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                List Your Items
              </h3>
              <p className="text-gray-600">
                Create listings for items you want to give away or sell. Add
                photos, descriptions, and your location.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm card-hover">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Locally
              </h3>
              <p className="text-gray-600">
                Browse items available in your area. Filter by location to find
                what you need nearby.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm card-hover">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Build Community
              </h3>
              <p className="text-gray-600">
                Meet your neighbors and build a stronger, more connected local
                community through sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LocalConnecto?
            </h2>
            <p className="text-lg text-gray-600">
              More than just a marketplace - we're building a platform for
              community connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location-Based
              </h3>
              <p className="text-gray-600">
                All listings are location-tagged so you can find items right in
                your neighborhood.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free & Paid Items
              </h3>
              <p className="text-gray-600">
                Choose to list items for free or set a price - flexibility for
                every situation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                User verification and community ratings help ensure safe
                transactions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community Focused
              </h3>
              <p className="text-gray-600">
                Built for neighbors to connect, reducing waste and helping each
                other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 bg-indigo-50 text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Community Says
              </h2>
              <p className="max-w-[700px] text-indigo-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of happy users in your local area
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-6 bg-white rounded-xl shadow-sm text-gray-800"
              >
                <div>
                  <p className="mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthorized && (
        <section className="py-20 bg-gradient-to-t from-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-indigo-700">
                  Ready to join your local community?
                </h2>
                <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up today and start discovering items in your neighborhood
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/login">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
                    Get Started Free
                  </button>
                </Link>
                <Link to="/listings">
                  <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md">
                    Browse Listings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const categories = [
  { name: "Free Items", slug: "free", icon: Gift },
  { name: "Furniture", slug: "furniture", icon: ShoppingBag },
  { name: "Electronics", slug: "electronics", icon: ShoppingBag },
  { name: "Clothing", slug: "clothing", icon: ShoppingBag },
  { name: "Books", slug: "books", icon: ShoppingBag },
  { name: "Toys", slug: "toys", icon: ShoppingBag },
  { name: "Sports", slug: "sports", icon: ShoppingBag },
  { name: "Other", slug: "other", icon: ShoppingBag },
];

const testimonials = [
  {
    text: "I found a free couch in my neighborhood that was exactly what I needed for my new apartment!",
    name: "Deekila Sherpa",
    location: "Pokhara, Kaski",
  },
  {
    text: "LocalConnecto helped me declutter my home and give items to people who actually needed them.",
    name: "Namrata Shrestha",
    location: "Thamel, Kathmandu",
  },
  {
    text: "I've met so many wonderful neighbors through exchanging items on this platform.",
    name: "Rohan Poudel",
    location: "Itahari, Sunsari",
  },
];

export default Home;
