import React from "react";
import { useNavigate } from "react-router-dom";


function Shipping() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

      
      <div className="bg-primary-600 text-white py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Shipping & Returns
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-lg opacity-90">
          Safe, fast, and reliable delivery for all your baby essentials.
        </p>
      </div>

      
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">

        
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border-t-4 border-primary-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🚚 Shipping Policy
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Orders processed within 1–2 business days.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Standard delivery: 5–7 business days.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Express shipping available at checkout.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Free shipping on orders above $100.
            </li>
          </ul>
          

          <div className="mt-6 bg-pink-50 border border-pink-200 p-4 rounded-lg text-sm">
            <strong>Important:</strong> Delivery timelines may vary during holidays or peak seasons.
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border-t-4 border-primary-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🔄 Return Policy
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Returns accepted within 7 days of delivery.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Products must be unused and sealed.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Refunds processed within 3–5 business days.
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">✔</span>
              Return shipping charges may apply.
            </li>
          </ul>

          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
            Hassle-free and secure return process guaranteed.
          </div>
        </div>

      </div>

      
      <div className="bg-gray-100 py-12 px-4 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Need Assistance?
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl mx-auto">
          Our support team is always here to help with your shipping or return queries.
        </p>
<button
  onClick={() => navigate("/contact")}
  className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition duration-300"
>
  Contact Support
</button>

      </div>

    </div>
  );
}

export default Shipping;
