import React from "react";

function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

     
      <div className="bg-primary-600 text-white py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-sm md:text-lg opacity-90">
          Please read these terms carefully.
        </p>
      </div>

     
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        <div className="bg-white shadow-md rounded-2xl p-8 border-l-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Use of Website
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            This website is intended for personal shopping use only.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8 border-l-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payments & Orders
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            All payments must be completed at checkout using supported payment methods.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8 border-l-4 border-primary-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Changes to Terms
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            We may update these terms at any time without prior notice.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Terms;
