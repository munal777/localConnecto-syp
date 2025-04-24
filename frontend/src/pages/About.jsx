import React from "react";
import { CheckCircle, Heart, Shield, Map, Gift, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { userAuthentication } from "../auth/auth";

function About() {
  const { isAuthorized } = userAuthentication();

  return (
    <div className="flex flex-col border-t-1 border-gray-300">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              About LocalConnecto
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're on a mission to help communities thrive through local
              exchange and connection.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 animate-fade-up">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  LocalConnecto was born from a simple observation: our neighborhoods are full of unused items that others might need, and we're missing opportunities to connect with the people who live right next door to us.
                </p>
                <p className="text-gray-600 mb-4">
                  Founded in 2024, my platform brings the sharing economy to the neighborhood level, allowing communities to reduce waste while building meaningful local connections.
                </p>
                <p className="text-gray-600">
                  I believe that strong local communities are built on small interactions - borrowing a ladder, gifting outgrown toys, or finding a new home for furniture you no longer need.
                </p>
              </div>
              <div className="md:w-1/2 animate-fade-in">
                <img 
                  src="/src/assets/aboutus.jpg" 
                  alt="Community gathering" 
                  className="rounded-2xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How LocalConnecto Works</h2>
            <p className="text-lg text-gray-600">
              Our platform is designed to be simple, intuitive, and community-focused.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-stagger">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up with your email and create a profile with your location and preferences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">List or Browse</h3>
                <p className="text-gray-600">
                  Create listings for items you want to give away or sell, or browse what's available near you.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Locally</h3>
                <p className="text-gray-600">
                  Communicate through our platform and arrange to meet up safely in your local area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className=" py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-indigo-700">
                Why Choose LocalConnecto
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Benefits that set us apart
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-indigo-700">
                  Community Focused
                </h3>
                <p className="text-gray-600">
                  We prioritize local connections, helping you meet and build
                  relationships with people in your neighborhood.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-indigo-700">
                  Environmentally Friendly
                </h3>
                <p className="text-gray-600">
                  By reusing and recycling items, we help reduce waste and
                  promote sustainable consumption habits.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-indigo-700">
                  Easy to Use
                </h3>
                <p className="text-gray-600">
                  Our intuitive platform makes it simple to list items, search
                  for what you need, and connect with others.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-indigo-700">
                  Safe and Secure
                </h3>
                <p className="text-gray-600">
                  User verification and community ratings help ensure safe and
                  trustworthy exchanges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do at LocalConnecto.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-stagger">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="mr-4">
                    <Heart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
                    <p className="text-gray-600">
                      We prioritize fostering genuine connections between neighbors and building stronger local communities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="mr-4">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Safety</h3>
                    <p className="text-gray-600">
                      We're committed to creating a secure platform where users can exchange with confidence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="mr-4">
                    <Map className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h3>
                    <p className="text-gray-600">
                      We believe in the power of local connections and supporting neighborhood economies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className="mr-4">
                    <Gift className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
                    <p className="text-gray-600">
                      By encouraging reuse and local exchange, we're helping communities reduce waste and consumption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default About;
