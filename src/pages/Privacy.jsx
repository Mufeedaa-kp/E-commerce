import React from "react";

function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

     
      <div className="bg-primary-600 text-white py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-sm md:text-lg opacity-90">
          Your trust matters to us.
        </p>
      </div>

     
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            We collect your name, email, phone number, and shipping address to process orders efficiently.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How We Use Your Data
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Your information is used strictly for order fulfillment and improving customer experience.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Security & Protection
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            We use secure encryption and never share your data with third parties.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Privacy;
